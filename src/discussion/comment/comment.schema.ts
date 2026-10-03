import z from "zod";

export const discussion_comment_schema = z.object({
  content: z.string().min(1)
})