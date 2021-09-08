import { BoxPanel } from '@lumino/widgets';
import { Signal, ISignal } from '@lumino/signaling';
import { createSearchEntry } from './searchoverlay';
import { requestAPI } from './handler';
import { createTable } from './searchTable';

//typescript requires you to declare the types
//you have and sometimes you have to create and
//specify them with these interfaces
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
        //why is this method post in here
        //because I want to post the data I received from the backend in
        //the jupyter frontend?
        method: 'POST'
      });
      this._searchResult.emit(data);
    } catch (reason) {
      console.error(
        `The search_replace server extension appears to be missing.\n${reason}`
      );
    }
  }

  //jupyter needs the signal slot model to be able to receave and realize
  //when something is updates
  //so this is the way to do it, we were just copying it from other jupyter repo
  //the thing is that this needs to be emitted
  //so we're doing it insinde the getSearchString method:
  // this._searchResult.emit(data);
  //the reason why  we're doing it here is because this is where we receive the
  //info from the backend, the new information, so this is the place where the info
  //is updated
  private _searchResult: Signal<SearchReplaceModel, ISearchReplace> =
    new Signal<SearchReplaceModel, ISearchReplace>(this);

  //this kind of stuff is called a getter
  //just does this, nothing much, not really necessary
  //just good practice I suppose
  get searchResult(): ISignal<SearchReplaceModel, ISearchReplace> {
    return this._searchResult;
  }
}

//TODO: fix css issue with buttons
//they must be centered
export class SearchReplaceView extends BoxPanel {
  constructor(model: SearchReplaceModel) {
    super({ direction: 'top-to-bottom' });
    this.addWidget(createSearchEntry());
    //why do I have to add a clalss to this replace view thing?
    //prbb just a good practice, i mean, it is used in the css
    //i think that's the main reason
    this.addClass('jp-search-replace-tab');
    this.addWidget(createTable(model));
  }
}
