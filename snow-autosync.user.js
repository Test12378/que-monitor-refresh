// ==UserScript==
// @name         Micron queue session auto-sync
// @namespace    https://test12378.github.io/que-monitor-refresh/
// @version      1.0
// @description  When you are logged into ServiceNow, send session to the queue monitor automatically. No cookie paste.
// @match        https://micron.service-now.com/*
// @run-at       document-idle
// @grant        none
// ==/UserScript==

(function () {
  const TOKEN = "KkpwzugV8JFdstVVJIdQrzxB8iHmmre8Xl5MJJLKw6c";
  const RPC = "https://qhkeirrhjjtdyvrdkbxn.supabase.co/rest/v1/rpc/upload_session_with_token";
  const ANON =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFoa2VpcnJoamp0ZHl2cmRrYnhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4MjY0MjEsImV4cCI6MjA5MjQwMjQyMX0.vgHg7uMrhaZ2YwKhmBKxrgmHzm83Ze3gD3XapXpGACc";
  const KEY = "queMonitorLastSync";
  const MIN_MS = 10 * 60 * 1000;

  const cookie = document.cookie || "";
  if (cookie.indexOf("JSESSIONID=") < 0) return;

  try {
    const last = Number(localStorage.getItem(KEY) || "0");
    if (Date.now() - last < MIN_MS) return;
  } catch (e) {}

  const gck = typeof window.g_ck === "string" ? window.g_ck : "";

  fetch(RPC, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: ANON,
      Authorization: "Bearer " + ANON,
    },
    body: JSON.stringify({ p_token: TOKEN, p_cookie: cookie, p_g_ck: gck }),
  })
    .then(function (r) {
      return r.json();
    })
    .then(function (d) {
      if (d && d.ok) {
        try {
          localStorage.setItem(KEY, String(Date.now()));
        } catch (e) {}
      }
    })
    .catch(function () {});
})();
