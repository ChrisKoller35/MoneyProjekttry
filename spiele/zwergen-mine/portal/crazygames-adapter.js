// Zwergen-Mine: Anbindung an CrazyGames (SDK v3).
// Wird von build-crazygames.js VOR dem Spiel-Skript eingefügt und setzt window.ZwergenMinePortal.
// Stand: nach der öffentlichen SDK-Doku geschrieben, gegen das echte Portal noch NICHT getestet
// (das geht erst mit einem Entwickler-Konto im QA-Werkzeug von CrazyGames).
(function () {
  let sdk = null, ready = false;
  const queue = [];
  const run = (fn) => { if (ready) { try { fn(); } catch (e) {} } else queue.push(fn); };
  const adEvent = (name) => window.dispatchEvent(new Event(name));   // 'zm-ad-start' / 'zm-ad-end': das Spiel pausiert und schaltet stumm
  (async () => {
    try {
      if (!window.CrazyGames || !window.CrazyGames.SDK) return;
      await window.CrazyGames.SDK.init();
      sdk = window.CrazyGames.SDK; ready = true;
      queue.splice(0).forEach((fn) => { try { fn(); } catch (e) {} });
    } catch (e) { /* ohne SDK läuft das Spiel einfach ohne Portal weiter */ }
  })();
  window.ZwergenMinePortal = {
    gameplayStart() { run(() => sdk.game.gameplayStart()); },
    gameplayStop() { run(() => sdk.game.gameplayStop()); },
    happytime() { run(() => sdk.game.happytime()); },
    // Freiwillige Werbung: Belohnung nur, wenn die Werbung zu Ende lief
    showRewardedAd(onReward) {
      if (!ready) return;   // kein SDK: keine Werbung, keine Belohnung
      let done = false;
      sdk.ad.requestAd('rewarded', {
        adStarted: () => adEvent('zm-ad-start'),
        adFinished: () => { adEvent('zm-ad-end'); if (!done) { done = true; onReward(); } },
        adError: () => adEvent('zm-ad-end'),
      });
    },
    // Rangliste gibt es bei CrazyGames nur für eingeladene Spiele; bis dahin tut das nichts.
    submitScore(points) {},
  };
})();
