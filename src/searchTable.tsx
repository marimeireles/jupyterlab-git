import { FixedSizeTree as Tree } from 'react-vtree';
import React from 'react';
import { Widget } from '@lumino/widgets';
import { ReactWidget, UseSignal } from '@jupyterlab/apputils';
import { SearchReplaceModel } from './searchReplace';

export function createTable(model: SearchReplaceModel): Widget {
  return ReactWidget.create(
    <UseSignal signal={model.searchResult} initialArgs={{ files: [] }}>
      {(_, data) => {
        const tree = {
          name: 'Root',
          id: 'root',
          children:
            data?.files.map(f => {
              const id = f.path.replace(/\/\./g, '-');
              return {
                name: f.path,
                id: id,
                children: f.found.map(g => {
                  return {
                    name: '',
                    id: `${id}-l-${g.line}-c-${g.column}`
                  };
                })
              };
            }) ?? []
        };

        function* treeWalker(refresh: boolean) {
          const stack = [];

          // Remember all the necessary data of the first node in the stack.
          stack.push({
            nestingLevel: 0,
            node: tree
          });

          // Walk through the tree until we have no nodes available.
          while (stack.length !== 0) {
            const {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              node: { children = [], id, name },
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              nestingLevel
            } = stack.pop()!;

            // Here we are sending the information about the node to the Tree component
            // and receive an information about the openness state from it. The
            // `refresh` parameter tells us if the full update of the tree is requested;
            // basing on it we decide to return the full node data or only the node
            // id to update the nodes order.
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const isOpened = yield refresh
              ? {
                  id,
                  isLeaf: children.length === 0,
                  isOpenByDefault: true,
                  name,
                  nestingLevel
                }
              : id;

            // Basing on the node openness state we are deciding if we need to render
            // the child nodes (if they exist).
            if (children.length !== 0 && isOpened) {
              // Since it is a stack structure, we need to put nodes we want to render
              // first to the end of the stack.
              for (let i = children.length - 1; i >= 0; i--) {
                stack.push({
                  nestingLevel: nestingLevel + 1,
                  node: children[i]
                });
              }
            }
          }
        }

        return (
          <Tree treeWalker={treeWalker} itemSize={30} height={150} width={300}>
            {Node as any}
          </Tree>
        );
      }}
    </UseSignal>
  );
}

// Tree component can work with any possible tree structure because it uses an
// iterator function that the user provides. Structure, approach, and iterator
// function below is just one of many possible variants.
const tree = {
  name: 'Root #1',
  id: 'root-1',
  children: [
    {
      children: [
        { id: 'child-2', name: 'Child #2' },
        { id: 'child-3', name: 'Child #3' }
      ],
      id: 'child-1',
      name: 'Child #1'
    },
    {
      children: [{ id: 'child-5', name: 'Child #5' }],
      id: 'child-4',
      name: 'Child #4'
    }
  ]
};

function* treeWalker(refresh: boolean) {
  const stack = [];

  // Remember all the necessary data of the first node in the stack.
  stack.push({
    nestingLevel: 0,
    node: tree
  });

  // Walk through the tree until we have no nodes available.
  while (stack.length !== 0) {
    const {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      node: { children = [], id, name },
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      nestingLevel
    } = stack.pop()!;

    // Here we are sending the information about the node to the Tree component
    // and receive an information about the openness state from it. The
    // `refresh` parameter tells us if the full update of the tree is requested;
    // basing on it we decide to return the full node data or only the node
    // id to update the nodes order.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const isOpened = yield refresh
      ? {
          id,
          isLeaf: children.length === 0,
          isOpenByDefault: true,
          name,
          nestingLevel
        }
      : id;

    // Basing on the node openness state we are deciding if we need to render
    // the child nodes (if they exist).
    if (children.length !== 0 && isOpened) {
      // Since it is a stack structure, we need to put nodes we want to render
      // first to the end of the stack.
      for (let i = children.length - 1; i >= 0; i--) {
        stack.push({
          nestingLevel: nestingLevel + 1,
          node: children[i]
        });
      }
    }
  }
}

// Node component receives all the data we created in the `treeWalker` +
// internal openness state (`isOpen`), function to change internal openness
// state (`toggle`) and `style` parameter that should be added to the root div.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const Node = ({ data: { isLeaf, name }, isOpen, style, toggle }) => (
  <div style={style}>
    {!isLeaf && (
      <button type="button" onClick={toggle}>
        {isOpen ? '-' : '+'}
      </button>
    )}
    <div>{name}</div>
  </div>
);

export const Example = () => (
  <Tree treeWalker={treeWalker} itemSize={30} height={150} width={300}>
    {Node as any}
  </Tree>
);
