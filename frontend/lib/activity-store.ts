export type ActivityType =
  | "test-case"
  | "gherkin"
  | "defect"
  | "api-test";

export type ActivityStatus =
  | "success"
  | "danger"
  | "info";

export type Activity = {
  id: string;
  type: ActivityType;
  status: ActivityStatus;
  title: string;
  description: string;
  timestamp: string;
};

const activities: Activity[] = [];

export function addActivity(
  activity: Omit<
    Activity,
    "id" | "timestamp"
  >
) {
  const newActivity: Activity = {
    ...activity,
    id: crypto.randomUUID(),
    timestamp:
      new Date().toISOString(),
  };

  activities.unshift(
    newActivity
  );

  // Mantener solamente
  // las últimas 50 actividades.
  if (activities.length > 50) {
    activities.splice(50);
  }

  return newActivity;
}

export function getActivities() {
  return [...activities];
}

export function clearActivities() {
  activities.length = 0;
}