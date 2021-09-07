import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { ISettingRegistry } from '@jupyterlab/settingregistry';

import { SearchReplaceView, SearchReplaceModel } from './searchReplace';
// import { SearchReplaceView, SearchReplaceModel } from './searchReplace';

/**
 * Initialization data for the search-replace extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'search-replace:plugin',
  autoStart: true,
  optional: [ISettingRegistry],
  activate: (
    app: JupyterFrontEnd,
    settingRegistry: ISettingRegistry | null
  ) => {
    console.log('JupyterLab extension search-replace is activated!');

    if (settingRegistry) {
      settingRegistry
        .load(plugin.id)
        .then(settings => {
          console.log('search-replace settings loaded:', settings.composite);
        })
        .catch(reason => {
          console.error('Failed to load settings for search-replace.', reason);
        });
    }

    const searchReplaceModel = new SearchReplaceModel();
    const searchReplacePlugin = new SearchReplaceView(searchReplaceModel);

    app.started.then(() => {
      searchReplaceModel.getSearchString('🌈');
    });

    searchReplacePlugin.title.caption = 'Search and replace';
    searchReplacePlugin.id = 'jp-search-replace';
    app.shell.add(searchReplacePlugin, 'left');
    //get an icon
  }
};

export default plugin;
