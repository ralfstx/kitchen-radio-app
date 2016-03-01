import config from "../model/config";
import { Page, TextView, TextInput } from "tabris";

const labelWidth = 120;

export default class SettingsPage extends Page {

  constructor() {
    super({
      title: "Settings",
      topLevel: true
    });
    new TextView({
      left: 16, top: 16, width: labelWidth - 4,
      text: "Server URL:"
    }).appendTo(this);
    new TextInput({
      left: labelWidth + 4, baseline: "prev()", right: 16,
      keyboard: "url",
      text: config.serverUrl
    }).on("blur", (view) => {
      config.serverUrl = view.get("text");
    }).appendTo(this);
  }

}
