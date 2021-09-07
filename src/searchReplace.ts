import { BoxPanel } from '@lumino/widgets';
import { Signal, ISignal } from '@lumino/signaling';
import { createSearchEntry } from './searchoverlay';
import { requestAPI } from './handler';
import { createTable } from './searchTable';

export interface ISearchReplace {
  files: Array<IFile>;
}

export interface IFile {
  path: string;
  found: Array<IFound>;
}

export interface IFound {
  string: string;
  line: number;
  column: number;
}
export class SearchReplaceModel {
  constructor() {
    this._searchString = '';
  }
  _searchString: string;

  async getSearchString(search: string): Promise<void> {
    try {
      const data = await requestAPI<any>('get_search_string', {
        body: JSON.stringify({ search }),
        method: 'POST'
      });
      this._searchResult.emit(data);
    } catch (reason) {
      console.error(
        `The search_replace server extension appears to be missing.\n${reason}`
      );
    }
  }

  private _searchResult: Signal<SearchReplaceModel, ISearchReplace> =
    new Signal<SearchReplaceModel, ISearchReplace>(this);

  get searchResult(): ISignal<SearchReplaceModel, ISearchReplace> {
    return this._searchResult;
  }
}

//TODO: fix css issue with buttons
export class SearchReplaceView extends BoxPanel {
  constructor(model: SearchReplaceModel) {
    super({ direction: 'top-to-bottom' });
    this.addWidget(createSearchEntry());
    this.addClass('jp-search-replace-tab');
    this.addWidget(createTable(model));
  }
}
