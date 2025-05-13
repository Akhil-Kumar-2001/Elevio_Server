"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const dotenv_1 = __importDefault(require("dotenv"));
const dbConfig_1 = __importDefault(require("./Config/dbConfig"));
const studentRouter_1 = __importDefault(require("./routes/student/studentRouter"));
const tutorRouter_1 = __importDefault(require("./routes/tutor/tutorRouter"));
const adminRouter_1 = __importDefault(require("./routes/admin/adminRouter"));
const chatRouter_1 = __importDefault(require("./routes/chat/chatRouter"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const socketConfig_1 = __importDefault(require("./Config/socketConfig"));
const morganMiddleware_1 = __importDefault(require("./middleware/morganMiddleware"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = (0, socketConfig_1.default)(server);
// CORS Configuration
app.use((0, cors_1.default)({
    origin: ((_a = process.env.CORS_ORIGIN) === null || _a === void 0 ? void 0 : _a.split(",")) || [],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.json({ limit: '100mb' }));
app.use(express_1.default.urlencoded({ limit: '100mb', extended: true }));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(morganMiddleware_1.default);
const PORT = process.env.PORT || 4000;
// Connect to Database
(0, dbConfig_1.default)();
// Routes
app.get("/", (req, res) => {
    res.send("Backend is running ✅");
});
app.use("/api/student", studentRouter_1.default);
app.use("/api/tutor", tutorRouter_1.default);
app.use("/api/admin", adminRouter_1.default);
app.use("/api/chat", chatRouter_1.default);
// Error Handling Middleware
app.use((err, req, res, next) => {
    console.log("Error handling middleware's errro in the app.ts file", err);
    res.status(500).json({ message: "Internal server error" });
    next();
});
// Start Server
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
