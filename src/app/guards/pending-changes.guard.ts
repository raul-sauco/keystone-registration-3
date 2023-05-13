import { CanDeactivateFn, UrlTree } from '@angular/router';
import { ComponentCanDeactivate } from '@interfaces/component-can-deactivate';
import { Observable } from 'rxjs';

/**
 * A guard that prompts the user when they try to navigate away from a component
 * while not having completed some task that the component considers necessary.
 * https://stackoverflow.com/a/75769104/2557030
 * An angular 15 update to this answer: https://stackoverflow.com/a/41187919/2557030
 * @param component
 * @returns
 */
export const PendingChangesGuard: CanDeactivateFn<ComponentCanDeactivate> = (
  component: ComponentCanDeactivate
): Observable<boolean | UrlTree> => {
  // No pending changes, allow deactivate; pending changes, request confirm.
  return new Observable<boolean | UrlTree>((obs) => {
    return component.canDeactivate()
      ? obs.next(true)
      : // NOTE: this warning message will only be shown when navigating elsewhere within your angular app;
        // when navigating away from your angular app, the browser will show a generic warning message
        // see http://stackoverflow.com/a/42207299/2557030
        obs.next(
          // TODO: Update the message to use the TranslateService.
          confirm('Warning: You have not submitted a payment proof image')
        );
  });
};
