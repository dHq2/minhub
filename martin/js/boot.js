/* martin/js/boot.js — 시작. 고칠 땐 이 줄 아래에 「11-16 A: …」처럼 날짜·방 주석 */
document.getElementById('ver').textContent = VER;
S = load(); renderAll(); act('열기', { ua:navigator.userAgent.slice(0, 90), w:innerWidth, h:innerHeight }); const dbReady = new Promise(ok => setTimeout(() => dbStart().finally(ok), 0));
requestAnimationFrame(async () => { measure(); renderStrings(); renderMarks(); const f = fitBox(); cam.x = f.x; cam.y = f.y; cam.k = f.k; applyCam(0);
  renderChat(true); if (isBlank(S)) await Promise.race([dbReady, sleep(12000)]);   /* 빈 판이면 계정 판을 먼저 받아 본 뒤에 인사 */
  if (!isBlank(S)) await speak(S.pending ? '돌아왔군. 지난 말에 아직 답을 못 했다.' : '돌아왔군. 판은 그대로다.', false); else if (!S.log.length){ for (const l of OPEN) await speak(l); save(); }
  await Promise.race([dbReady, sleep(5000)]); if (!busy){ setBusy(true); try{ await brief(); }catch(e){} setBusy(false); } });
