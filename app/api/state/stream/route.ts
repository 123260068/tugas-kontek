import { publicState } from "@/lib/state";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const encoder = new TextEncoder();
  let closed = false;
  let lastPayload = "";
  let timer: ReturnType<typeof setInterval> | undefined;

  const stream = new ReadableStream({
    start(controller) {
      const publish = async () => {
        if (closed) return;
        try {
          const state = await publicState();
          const signature = JSON.stringify({ ...state, serverTime: 0 });
          if (signature === lastPayload) return;
          lastPayload = signature;
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(state)}\n\n`));
        } catch (error) {
          if (timer) clearInterval(timer);
          controller.error(error);
        }
      };

      void publish();
      timer = setInterval(() => { void publish(); }, 1000);
    },
    cancel() {
      closed = true;
      if (timer) clearInterval(timer);
    },
  });

  return new Response(stream, {
    headers: {
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "Content-Type": "text/event-stream",
    },
  });
}
