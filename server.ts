import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Mock Data
  let resources = [
    { id: "1", name: "Main Hall", type: "ROOM", capacity: 500, location: "Block A", status: "AVAILABLE" },
    { id: "2", name: "Computer Lab 01", type: "LAB", capacity: 30, location: "Block B", status: "AVAILABLE" },
    { id: "3", name: "Projector P-09", type: "EQUIPMENT", capacity: 1, location: "Library", status: "MAINTENANCE" },
  ];

  let bookings = [];
  let tickets = [];
  let notifications = [
    { id: "1", message: "Welcome to the Smart Campus Hub!", type: "INFO", timestamp: new Date() }
  ];

  // API Routes
  app.get("/api/resources", (req, res) => res.json(resources));
  
  app.get("/api/bookings", (req, res) => res.json(bookings));
  app.post("/api/bookings", (req, res) => {
    const newBooking = { ...req.body, id: Date.now().toString(), status: "PENDING" };
    // Simple conflict check
    const conflict = bookings.find(b => 
      b.resourceId === newBooking.resourceId && 
      b.status === "APPROVED" &&
      ((new Date(newBooking.startTime) < new Date(b.endTime)) && (new Date(newBooking.endTime) > new Date(b.startTime)))
    );
    if (conflict) return res.status(400).json({ error: "Time slot already booked" });
    bookings.push(newBooking);
    res.status(201).json(newBooking);
  });

  app.get("/api/tickets", (req, res) => res.json(tickets));
  app.post("/api/tickets", (req, res) => {
    const newTicket = { ...req.body, id: Date.now().toString(), status: "OPEN", createdAt: new Date() };
    tickets.push(newTicket);
    res.status(201).json(newTicket);
  });

  app.get("/api/notifications", (req, res) => res.json(notifications));

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
