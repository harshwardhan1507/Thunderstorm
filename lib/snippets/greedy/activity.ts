export const activitySnippets = {
  javascript: `function activitySelection(activities) {
  // Sort activities by end time
  activities.sort((a, b) => a.end - b.end);
  let selected = [activities[0]];
  let lastEnd = activities[0].end;
  for (let i = 1; i < activities.length; i++) {
    let act = activities[i];
    if (act.start >= lastEnd) {
      selected.push(act);
      lastEnd = act.end;
    }
  }
  return selected;
}`,
  java: `List<Activity> selectActivities(List<Activity> list) {
  list.sort((a, b) -> a.end - b.end);
  List<Activity> selected = new ArrayList<>();
  selected.add(list.get(0));
  int lastEnd = list.get(0).end;
  for (int i = 1; i < list.size(); i++) {
    Activity act = list.get(i);
    if (act.start >= lastEnd) {
      selected.add(act);
      lastEnd = act.end;
    }
  }
  return selected;
}`,
  python: `def activitySelection(activities):
  activities.sort(key=lambda x: x.end)
  selected = [activities[0]]
  last_end = activities[0].end
  for i in range(1, len(activities)):
    act = activities[i]
    if act.start >= last_end:
      selected.append(act)
      last_end = act.end
  return selected`,
  cpp: `vector<Activity> activitySelection(vector<Activity>& activities) {
  sort(activities.begin(), activities.end(), [](const Activity& a, const Activity& b) {
    return a.end < b.end;
  });
  vector<Activity> selected = {activities[0]};
  int lastEnd = activities[0].end;
  for (int i = 1; i < activities.size(); i++) {
    if (activities[i].start >= lastEnd) {
      selected.push_back(activities[i]);
      lastEnd = activities[i].end;
    }
  }
  return selected;
}`
};
