/* martin/js/boot.js — 시작. 고칠 땐 이 줄 아래에 「11-16 A: …」처럼 날짜·방 주석 */
document.getElementById('ver').textContent = VER;
S = load(); renderAll(); act('열기', { ua:navigator.userAgent.slice(0, 90), w:innerWidth, h:innerHeight }); const dbReady = new Promise(ok => setTimeout(() => dbStart().finally(ok), 0));
requestAnimationFrame(async () => { measure(); renderStrings(); renderMarks(); const f = fitBox(); cam.x = f.x; cam.y = f.y; cam.k = f.k; applyCam(0);
  renderChat(true); if (isBlank(S)) await Promise.race([dbReady, sleep(12000)]);   /* 빈 판이면 계정 판을 먼저 받아 본 뒤에 인사 */
  if (!isBlank(S)){   /* 11-16 C: 하던 판 — 먼저 '…'(생각 중), 계정 판·본 버전을 받아 본 뒤 손질이 있으면 브리핑이 곧 인사, 없으면 「돌아왔군. 판은 그대로다.」 */
    const t0 = Date.now(); thinking(true); await Promise.race([dbReady, sleep(5000)]); await sleep(Math.max(0, 800 - (Date.now() - t0))); if (busy) return;   /* … 는 적어도 0.8초 — 생각하는 틈으로 읽히게 */   /* 그사이 동료가 말을 건넸으면 그쪽이 먼저 */
    thinking(true); setBusy(true); let told = false; try{ told = await brief(true); }catch(e){} thinking(false); setBusy(false);
    if (S.pending) await speak(told ? '그리고 지난 말엔 아직 답을 못 했다.' : '돌아왔군. 지난 말에 아직 답을 못 했다.', false);
    else if (!told) await speak('돌아왔군. 판은 그대로다.', false);
    return; }
  if (!S.log.length){ for (const l of OPEN) await speak(l); save(); }
  await Promise.race([dbReady, sleep(5000)]); if (!busy){ setBusy(true); try{ await brief(); }catch(e){} setBusy(false); } });
