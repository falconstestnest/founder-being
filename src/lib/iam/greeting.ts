export function timeGreeting(date = new Date()) {
  const h = date.getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export function firstName(fullName: string) {
  const part = fullName.trim().split(/\s+/)[0];
  return part || "there";
}
