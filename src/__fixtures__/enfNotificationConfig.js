export default [
  {
    minRiskScore: 0,
    maxRiskScore: 100,
    alertTitle: "You are a close contact of COVID-19",
    alertMessage:
      "Please go home and self-isolate. Then call Healthline on 0800 358 5453",
    linkUrl: "https://www.health.govt.nz/nz-covid-tracer-about-bt-alerts",
  },
  {
    minRiskScore: 101,
    maxRiskScore: 101,
    alertTitle: "[101] title",
    alertMessage: "[101] message",
    linkUrl: "[101] url",
  },
  {
    minRiskScore: 102,
    maxRiskScore: 200,
    alertTitle: "[102-200] title",
    alertMessage: "[102-200] message",
    linkUrl: "[102] url",
  },
];
