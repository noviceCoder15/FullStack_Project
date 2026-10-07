import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from './server/db.js';
import { classifyIssueWithGemini } from './server/aiClassifier.js';
import { Issue, Bid } from './src/types/civic.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Allow generous payload limits for civic photo uploads (base64)
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// ==========================================
// API ROUTES
// ==========================================

// Current logged in user (or default citizen)
let currentUserId = 'user_cit_1';

// 1. Auth routes
app.get('/api/auth/me', (req, res) => {
  const user = db.getUserById(currentUserId) || db.getUsers()[0];
  res.json({ success: true, user });
});

app.post('/api/auth/quick-switch', (req, res) => {
  const { role, userId } = req.body;
  if (userId) {
    const user = db.getUserById(userId);
    if (user) {
      currentUserId = user.id;
      return res.json({ success: true, user });
    }
  }

  if (role) {
    const match = db.getUsers().find(u => u.role === role);
    if (match) {
      currentUserId = match.id;
      return res.json({ success: true, user: match });
    }
  }

  const user = db.getUserById(currentUserId) || db.getUsers()[0];
  res.json({ success: true, user });
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, role, district, companyName, specialties } = req.body;
  const id = `user_${Date.now()}`;
  const newUser = {
    id,
    name: name || 'Civic Participant',
    email: email || `user_${Date.now()}@civicconnect.org`,
    role: role || 'Citizen',
    avatar: `https://images.unsplash.com/photo-${role === 'Contractor' ? '1500648767791-00dcc994a43e' : '1534528741775-53994a69daeb'}?auto=format&fit=crop&w=200&q=80`,
    district: district || 'Metropolitan Core',
    ...(role === 'Contractor' ? {
      contractorProfile: {
        companyName: companyName || `${name} Engineering Ltd`,
        licenseNumber: `LIC-MUN-${Math.floor(10000 + Math.random() * 90000)}`,
        rating: 5.0,
        completedJobsCount: 0,
        specialties: specialties || ['Roads & Potholes'],
        verified: true,
        phone: '+1 (555) 019-2834',
        hourlyRate: 75
      }
    } : {})
  };

  db.addUser(newUser as any);
  currentUserId = id;
  res.json({ success: true, user: newUser });
});

// 2. AI Classifier API
app.post('/api/ai/classify', async (req, res) => {
  try {
    const { title, description, imageBase64, mimeType } = req.body;
    if (!title && !description) {
      return res.status(400).json({ success: false, error: 'Title or description required for AI analysis' });
    }

    const imagePayload = imageBase64 ? { dataBase64: imageBase64, mimeType: mimeType || 'image/jpeg' } : undefined;
    const analysis = await classifyIssueWithGemini(title || 'Civic infrastructure issue', description || '', imagePayload);

    res.json({ success: true, analysis });
  } catch (error: any) {
    console.error('AI Classification API error:', error);
    res.status(500).json({ success: false, error: error.message || 'AI Classification failed' });
  }
});

// 3. Issues CRUD
app.get('/api/issues', (req, res) => {
  const { department, severity, status, district, search, reporterId, contractorId } = req.query;
  const issues = db.getIssues({
    department: department as string,
    severity: severity as string,
    status: status as string,
    district: district as string,
    search: search as string,
    reporterId: reporterId as string,
    contractorId: contractorId as string,
  });
  res.json({ success: true, count: issues.length, issues });
});

app.get('/api/issues/:id', (req, res) => {
  const issue = db.getIssueById(req.params.id);
  if (!issue) {
    return res.status(404).json({ success: false, error: 'Issue not found' });
  }
  const bids = db.getBids(issue.id);
  res.json({ success: true, issue, bids });
});

app.post('/api/issues', async (req, res) => {
  try {
    const { title, description, images, location, department, severity, runAI } = req.body;
    const currentUser = db.getUserById(currentUserId) || db.getUsers()[0];

    let aiAnalysis = req.body.aiAnalysis;
    let finalDepartment = department || 'Roads & Potholes';
    let finalSeverity = severity || 'Medium';

    // Check for duplicate active issue to prevent duplicates
    const duplicate = db.findDuplicateIssue(title || '', description, location);
    if (duplicate) {
      // Auto-record endorsement/upvote on existing issue
      if (!duplicate.upvotedByUserIds.includes(currentUser.id)) {
        db.toggleUpvote(duplicate.id, currentUser.id);
      }
      return res.status(409).json({
        success: false,
        isDuplicate: true,
        issue: duplicate,
        error: `Duplicate report prevented: A similar active issue "${duplicate.title}" (${duplicate.id}) already exists at this location. Your upvote has been automatically registered on the existing report.`
      });
    }

    // Run AI classification if requested or not provided
    if (runAI !== false && (!aiAnalysis || !department)) {
      const primaryImage = images && images.length > 0 ? images[0] : undefined;
      const imagePayload = primaryImage ? { dataBase64: primaryImage, mimeType: 'image/jpeg' } : undefined;
      aiAnalysis = await classifyIssueWithGemini(title, description, imagePayload);
      finalDepartment = aiAnalysis.department;
      finalSeverity = aiAnalysis.severity;
    }

    const newIssueId = `ISSUE-${1000 + db.getIssues().length + 1}`;
    const timestamp = new Date().toISOString();

    const newIssue: Issue = {
      id: newIssueId,
      title: title || 'Reported Civic Problem',
      description: description || 'No description provided.',
      images: Array.isArray(images) && images.length > 0 ? images : [
        'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80'
      ],
      department: finalDepartment,
      severity: finalSeverity,
      status: 'AI Classified',
      location: location || {
        lat: 37.7749 + (Math.random() - 0.5) * 0.05,
        lng: -122.4194 + (Math.random() - 0.5) * 0.05,
        address: 'Market & 8th Street, Civic District',
        district: 'Downtown'
      },
      reporter: {
        id: currentUser.id,
        name: currentUser.name,
        avatar: currentUser.avatar,
        email: currentUser.email
      },
      aiAnalysis,
      timeline: [
        {
          status: 'Submitted',
          timestamp,
          actor: currentUser.name,
          actorRole: currentUser.role,
          note: 'Submitted issue via CivicConnect portal.'
        },
        {
          status: 'AI Classified',
          timestamp: new Date(Date.now() + 1000).toISOString(),
          actor: 'Civic AI Engine (Gemini 3.8 Flash)',
          actorRole: 'AI Engine',
          note: `Categorized into ${finalDepartment} with ${finalSeverity} priority.`
        }
      ],
      upvotes: 1,
      upvotedByUserIds: [currentUser.id],
      bidsCount: 0,
      createdAt: timestamp,
      updatedAt: timestamp
    };

    db.createIssue(newIssue);
    res.status(201).json({ success: true, issue: newIssue });
  } catch (error: any) {
    console.error('Error creating issue:', error);
    res.status(500).json({ success: false, error: error.message || 'Failed to submit issue' });
  }
});

// 4. Update status & resolution
app.patch('/api/issues/:id/status', (req, res) => {
  const { status, note, contractorWorkNotes, afterImage, beforeImage, resolutionNotes } = req.body;
  const issue = db.getIssueById(req.params.id);
  if (!issue) {
    return res.status(404).json({ success: false, error: 'Issue not found' });
  }

  const currentUser = db.getUserById(currentUserId) || db.getUsers()[0];

  const updates: Partial<Issue> = {};
  if (status) updates.status = status;
  if (contractorWorkNotes) updates.contractorWorkNotes = contractorWorkNotes;
  if (afterImage) updates.afterImage = afterImage;
  if (beforeImage) updates.beforeImage = beforeImage;
  if (resolutionNotes) updates.resolutionNotes = resolutionNotes;
  if (status === 'Resolved') updates.resolvedAt = new Date().toISOString();

  // Add timeline entry
  const updatedTimeline = [...issue.timeline];
  if (status || note) {
    updatedTimeline.push({
      status: status || issue.status,
      timestamp: new Date().toISOString(),
      actor: currentUser.name,
      actorRole: currentUser.role,
      note: note || `Status updated to ${status} by ${currentUser.name}`
    });
    updates.timeline = updatedTimeline;
  }

  const updated = db.updateIssue(issue.id, updates);
  res.json({ success: true, issue: updated });
});

// 5. Upvote issue
app.post('/api/issues/:id/upvote', (req, res) => {
  const currentUser = db.getUserById(currentUserId) || db.getUsers()[0];
  const updated = db.toggleUpvote(req.params.id, currentUser.id);
  if (!updated) {
    return res.status(404).json({ success: false, error: 'Issue not found' });
  }
  res.json({ success: true, issue: updated });
});

// 6. Bids & Tenders
app.get('/api/bids', (req, res) => {
  const { issueId, contractorId } = req.query;
  const bids = db.getBids(issueId as string, contractorId as string);
  res.json({ success: true, bids });
});

app.post('/api/bids', (req, res) => {
  const { issueId, bidAmount, estimatedDays, proposedPlan } = req.body;
  const currentUser = db.getUserById(currentUserId) || db.getUsers()[0];

  if (!currentUser.contractorProfile && currentUser.role !== 'Contractor') {
    return res.status(403).json({ success: false, error: 'Only contractors can submit tender bids.' });
  }

  const issue = db.getIssueById(issueId);
  if (!issue) {
    return res.status(404).json({ success: false, error: 'Tender issue not found' });
  }
  if (issue.status === 'Resolved') {
    return res.status(400).json({ success: false, error: 'This issue is already resolved and closed for bidding.' });
  }

  // Prevent duplicate bid from the same contractor
  const existingBid = db.hasContractorBid(issueId, currentUser.id);
  if (existingBid) {
    return res.status(409).json({
      success: false,
      isDuplicate: true,
      bid: existingBid,
      error: `Duplicate bid prevented: You have already placed a bid ($${existingBid.bidAmount}, Status: ${existingBid.status}) on this tender.`
    });
  }

  const newBid: Bid = {
    id: `BID-${Math.floor(100 + Math.random() * 900)}`,
    issueId,
    contractorId: currentUser.id,
    contractorName: currentUser.contractorProfile?.companyName || currentUser.name,
    contractorRating: currentUser.contractorProfile?.rating || 4.9,
    contractorAvatar: currentUser.avatar,
    licenseNumber: currentUser.contractorProfile?.licenseNumber || 'LIC-VERIFIED',
    bidAmount: Number(bidAmount) || 500,
    estimatedDays: Number(estimatedDays) || 2,
    proposedPlan: proposedPlan || 'Standard municipal engineering restoration plan.',
    status: 'Pending',
    createdAt: new Date().toISOString()
  };

  const created = db.createBid(newBid);
  res.status(201).json({ success: true, bid: created });
});

app.post('/api/bids/:id/accept', (req, res) => {
  const currentUser = db.getUserById(currentUserId) || db.getUsers()[0];
  const result = db.acceptBid(req.params.id, currentUser.name);
  if (!result.bid) {
    return res.status(404).json({ success: false, error: 'Bid not found' });
  }
  res.json({ success: true, issue: result.issue, bid: result.bid });
});

app.post('/api/issues/:id/assign-direct', (req, res) => {
  const { contractorId, allocatedBudget } = req.body;
  const currentUser = db.getUserById(currentUserId) || db.getUsers()[0];
  const issue = db.assignDirectly(req.params.id, contractorId, currentUser.name, allocatedBudget);
  if (!issue) {
    return res.status(404).json({ success: false, error: 'Issue or contractor not found' });
  }
  res.json({ success: true, issue });
});

// 7. Contractor Directory
app.get('/api/contractors', (req, res) => {
  const contractors = db.getUsers().filter(u => u.role === 'Contractor');
  res.json({ success: true, contractors });
});

// 8. Stats & Municipal KPIs
app.get('/api/stats', (req, res) => {
  const stats = db.getStats();
  res.json({ success: true, stats });
});

// 9. Reset seed data
app.post('/api/seed/reset', (req, res) => {
  db.resetSeed();
  res.json({ success: true, message: 'Database reset to initial demo seeds.' });
});

// ==========================================
// VITE DEV SERVER / STATIC HOSTING
// ==========================================
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[CivicConnect] Full-stack Server running at http://localhost:${PORT}`);
  });
}

startServer();
