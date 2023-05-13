import { Observable } from 'rxjs';

/**
 * Implement this interface for components that want to have a
 * check before they are deactivated.
 */
export interface ComponentCanDeactivate {
  canDeactivate: () => boolean | Observable<boolean>;
}
