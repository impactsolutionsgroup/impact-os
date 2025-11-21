import { Router } from "itty-router"
import { handlePrompt } from "./routes/prompt.js"
import { handleOrgChart } from "./routes/orgchart.js"
import { handleDepartment } from "./routes/department.js"
import { handleKnowledge } from "./routes/knowledge.js"

const router = Router()

router.post("/api/prompt", handlePrompt)
router.post("/api/orgchart", handleOrgChart)
router.post("/api/department", handleDepartment)
router.post("/api/knowledge", handleKnowledge)

router.all("*", () => new Response("Not Found", { status: 404 }))

export default {
  fetch(request, env, ctx) {
    return router.handle(request, env, ctx)
