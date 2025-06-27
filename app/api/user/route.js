import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.toLowerCase() || "";

    if (!search) return Response.json([]);

    const users = await prisma.user.findMany({
      where: {
        OR: [
          { email: { contains: search, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        email: true,
      },
      take: 10,
    });

    return Response.json(users);
  } catch (error) {
    console.error("API ERROR:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
