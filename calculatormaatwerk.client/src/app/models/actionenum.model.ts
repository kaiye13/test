export enum Action {
    CHANGE_PRODUCT = 1,
    ADD = 2,
  }


export function getActionString(action: Action): string {
  switch (action) {
      case Action.CHANGE_PRODUCT:
          return 'CHANGE_PRODUCT';
      case Action.ADD:
          return 'ADD';
      default:
          return 'UNKNOWN';
  }
}