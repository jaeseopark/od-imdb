const OD_IMDB_URL = "http://localhost:2015/";
const MENU_ITEM_ID = "od-imdb-context-menu";

const openInOdImdb = ({ menuItemId, pageUrl }) => {
  if (menuItemId !== MENU_ITEM_ID) return;

  const url = new URL(OD_IMDB_URL);
  url.search = new URLSearchParams({ od: pageUrl }).toString();
  //   window.open(url);
  chrome.tabs.update({ url: url.toString() });
};

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: MENU_ITEM_ID,
    title: "Show IMDB info",
  });
});

chrome.contextMenus.onClicked.addListener(openInOdImdb);
