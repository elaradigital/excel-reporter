import SuperJSON from "superjson";

import { axios } from "./axios";

type WorkOrder = {
  id: string;
  number: number;
  title: string;
  type: "preventive" | "reactive" | "other";
  status:
    | "planned"
    | "open"
    | "in_progress"
    | "in_review"
    | "on_hold"
    | "done"
    | "cancelled";
  priority: "none" | "low" | "medium" | "high";
  createdAt: Date;
  dueDate: Date | null;
  startedAt: Date | null;
  endedAt: Date | null;
  location: { name: string };
  categories: { category: { name: string } }[];
  teams: { team: { name: string } }[];
  assets: { asset: { name: string; place?: { name: string } } }[];
  timeReports: {
    startedAt: Date;
    description: string;
    durationMinutes: number;
    user: { name: string };
  }[];
};

export const getWorkOrders = async (where: {
  [key: string]: unknown;
}): Promise<WorkOrder[]> => {
  const serialized = SuperJSON.serialize({
    where,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      number: true,
      title: true,
      type: true,
      status: true,
      priority: true,
      dueDate: true,
      createdAt: true,
      startedAt: true,
      endedAt: true,
      location: { select: { name: true } },
      categories: { select: { category: { select: { name: true } } } },
      teams: { select: { team: { select: { name: true } } } },
      assets: {
        select: {
          asset: {
            select: {
              name: true,
              place: { select: { name: true } },
            },
          },
        },
      },
      timeReports: {
        orderBy: { startedAt: "desc" },
        select: {
          startedAt: true,
          description: true,
          durationMinutes: true,
          user: { select: { name: true } },
        },
      },
    },
  });

  const q = encodeURIComponent(JSON.stringify(serialized.json));
  const meta = encodeURIComponent(JSON.stringify(serialized.meta));

  const { data } = await axios.get(`/workOrder/findMany?q=${q}&meta=${meta}`);

  return SuperJSON.deserialize<WorkOrder[]>({
    json: data.data,
    meta: data.meta,
  });
};
