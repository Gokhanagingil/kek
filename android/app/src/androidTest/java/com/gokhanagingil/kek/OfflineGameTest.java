package com.gokhanagingil.kek;

import android.content.ClipboardManager;
import android.content.Context;
import android.content.pm.PackageManager;
import androidx.test.core.app.ActivityScenario;
import androidx.test.ext.junit.runners.AndroidJUnit4;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicReference;
import static org.junit.Assert.*;

/** Integration checks run inside an Android emulator with the bundled game. */
@RunWith(AndroidJUnit4.class)
public final class OfflineGameTest {
    private ActivityScenario<MainActivity> scenario;

    @Before public void openCleanGame() throws Exception {
        scenario=ActivityScenario.launch(MainActivity.class);
        await("!!document.querySelector('[data-action=start]')");
        js("localStorage.clear(); location.reload();");
        await("!!document.querySelector('[data-action=start]') && !document.querySelector('[data-action=continue]')");
    }
    @After public void close() { if(scenario!=null) scenario.close(); }

    private String js(String expression) throws Exception {
        CountDownLatch done=new CountDownLatch(1);
        AtomicReference<String> result=new AtomicReference<>();
        scenario.onActivity(activity -> activity.gameView().evaluateJavascript(expression, value -> {
            result.set(value);done.countDown();
        }));
        assertTrue("JavaScript callback timeout",done.await(10,TimeUnit.SECONDS));
        return result.get();
    }
    private void await(String condition) throws Exception {
        for(int i=0;i<100;i++){
            if("true".equals(js(condition)))return;
            Thread.sleep(100);
        }
        fail("Condition not reached: "+condition+"; page="+js("document.body.innerText.slice(0,1000)"));
    }
    private void click(String selector) throws Exception { js("document.querySelector('"+selector+"').click()"); }
    private void moveToCek() throws Exception {
        click("[data-action=start]");
        await("!!document.querySelector('#word-tiles')");
        click("[data-key=Ç]");click("[data-action=submit]");
        await("document.querySelector('#current-label').textContent.startsWith('ÇEK')");
    }

    @Test public void offlineDictionaryAndActualMoves() throws Exception {
        scenario.onActivity(activity -> {
            assertEquals(PackageManager.PERMISSION_DENIED,activity.checkSelfPermission("android.permission.INTERNET"));
            assertFalse(activity.gameView().getSettings().getAllowFileAccess());
            assertFalse(activity.gameView().getSettings().getAllowContentAccess());
        });
        click("footer [data-action=dictionary]");
        await("!!document.querySelector('#word-search')");
        assertTrue(js("document.querySelector('#modal-content').textContent").contains("7.564"));
        for(String word:new String[]{"KAZMA","SÜTÇÜ","AHMAK"}){
            js("document.querySelector('#word-search').value='"+word+"';document.querySelector('#word-search').dispatchEvent(new Event('input',{bubbles:true}));");
            assertTrue(js("document.querySelector('#search-summary').textContent").contains(word+" kabul edilir"));
        }
        for(String word:new String[]{"EVİ","EVE"}){
            js("document.querySelector('#word-search').value='"+word+"';document.querySelector('#word-search').dispatchEvent(new Event('input',{bubbles:true}));");
            assertTrue(js("document.querySelector('#search-summary').textContent").contains("Tam eşleşme yok"));
        }
        click("[data-action=close]");moveToCek();
        js("document.querySelectorAll('.letter')[1].click()");click("[data-key=O]");click("[data-action=submit]");
        await("document.querySelector('#move-count').textContent==='2'");
        assertTrue(js("document.querySelector('#current-label').textContent").contains("ÇOK"));
    }

    @Test public void savedGameSurvivesActivityRecreationAndBackIsSafe() throws Exception {
        moveToCek();
        scenario.recreate();
        await("!!document.querySelector('[data-action=continue]')");
        click("[data-action=continue]");
        await("document.querySelector('#current-label').textContent.startsWith('ÇEK')");
        scenario.onActivity(MainActivity::onBackPressed);
        await("document.querySelector('dialog').open && !!document.querySelector('[data-action=exit-confirm]')");
        scenario.onActivity(MainActivity::onBackPressed);
        await("!document.querySelector('dialog').open");
        assertEquals("\"1\"",js("document.querySelector('#move-count').textContent"));
    }

    @Test public void duelTurnAndSmallScreenLayout() throws Exception {
        click("[data-mode=duel]");click("[data-action=start]");
        await("!!document.querySelector('#turn-text')");
        assertTrue(js("document.querySelector('#turn-text').textContent").contains("Oyuncu 1"));
        click("[data-key=Ç]");click("[data-action=submit]");
        await("document.querySelector('#turn-text').textContent==='Oyuncu 2'");
        assertEquals("true",js("document.documentElement.scrollWidth<=window.innerWidth"));
        scenario.onActivity(activity -> {
            int[] position=new int[2];activity.gameView().getLocationOnScreen(position);
            assertTrue("Status bar should not cover game",position[1]>0);
            assertTrue(activity.gameView().getHeight()>0);
        });
    }

    @Test public void localClipboardBridgeWorks() throws Exception {
        js("navigator.clipboard.writeText('KEK · 2 kelime').then(()=>document.body.dataset.copy='ok').catch(()=>document.body.dataset.copy='fail')");
        await("document.body.dataset.copy==='ok'");
        scenario.onActivity(activity -> {
            ClipboardManager clipboard=(ClipboardManager)activity.getSystemService(Context.CLIPBOARD_SERVICE);
            assertNotNull(clipboard.getPrimaryClip());
            assertEquals("KEK · 2 kelime",clipboard.getPrimaryClip().getItemAt(0).getText().toString());
        });
    }
}
