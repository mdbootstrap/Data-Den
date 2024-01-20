'use strict';

import { DPL } from '../dynamic-parts-loader.js';

export const authModal = DPL.defineComponent({
  selector: '#dpl-auth-modal',
  template: (userData) => {
    return `<div class="modal fade" id="navbarLogin" tabindex="-1" role="dialog">
  <div class="modal-dialog" role="document">

    <!-- Modal content -->
    <div class="modal-content">
      <!-- Modal body -->
      <div class="modal-body">

        <!-- Pills navs -->
        <ul class="nav nav-pills nav-justified mb-3">
          <li class="nav-item" role="presentation">
            <a class="nav-link" data-mdb-pill-init href="#navbarLogin-login" role="tab" aria-selected="true">Login</a>
          </li>
          <li class="nav-item" role="presentation">
            <a class="nav-link active show" data-mdb-pill-init href="#navbarLogin-signup" role="tab" aria-selected="true">Register</a>
          </li>
        </ul>

        <!-- Pills panels -->
        <div class="tab-content">

          <!--Panel 1-->
          <div class="tab-pane fade" id="navbarLogin-login" role="tabpanel">

            <!-- Default form login -->
            <form id="login" class="text-center needs-validation" action="login" method="post" name="login-form">

              <p class="status"></p>

              <div class="text-center mb-3">
                <div class="wp-social-login-widget">
                    <div class="wp-social-login-connect-with">Connect with:</div>
                    <div class="wp-social-login-provider-list">
                        <a rel="nofollow" href="https://mdbootstrap.com/wp-login.php?action=wordpress_social_authenticate&mode=login&provider=Facebook&redirect_to=${encodeURIComponent(
                          location.href
                        )}" title="Connect with Facebook" class="wp-social-login-provider wp-social-login-provider-facebook btn btn-primary btn-floating mx-1 ripple-surface" data-provider="Facebook" role="button" style="min-width: 37px;"><i class="fab fa-facebook-f"></i></a>
                        <a rel="nofollow" href="https://mdbootstrap.com/wp-login.php?action=wordpress_social_authenticate&mode=login&provider=Google&redirect_to=${encodeURIComponent(
                          location.href
                        )}" title="Connect with Google" class="wp-social-login-provider wp-social-login-provider-google btn btn-primary btn-floating mx-1" data-provider="Google" role="button"><i class="fab fa-google"></i></a>
                        <a rel="nofollow" href="https://mdbootstrap.com/wp-login.php?action=wordpress_social_authenticate&mode=login&provider=Twitter&redirect_to=${encodeURIComponent(
                          location.href
                        )}" title="Connect with Twitter" class="wp-social-login-provider wp-social-login-provider-twitter btn btn-primary btn-floating mx-1" data-provider="Twitter" role="button"><i class="fab fa-twitter"></i></a>
                    </div>
                </div>
              </div>

              <p class="text-center">or:</p>

              <!-- Email input -->
              <div data-mdb-input-init class="form-outline form-auth-mdb mb-4">
                <input type="text" id="username" class="form-control" name="username" required />
                <label class="form-label" for="username">Your e-mail or username</label>
              </div>

              <!-- Password input -->
              <div data-mdb-input-init class="form-outline form-auth-mdb mb-4">
                <input type="password" id="password" class="form-control" name="password" autocomplete="off" required />
                <label class="form-label" for="password">Your password</label>
              </div>

              <!-- 2 column grid layout for inline styling -->
              <div class="justify-content-center mb-4">
                  <a href="https://mdbootstrap.com/my-account/lost-password/">Forgot password?</a>
              </div>

              <button class="btn btn-primary btn-block mb-4" type="submit" value="LOGIN">Sign in</button>

              <!-- Register buttons -->
              <div class="text-center">
                <p>Not a member? <a href="#" class="auth-modal-toggle" data-auth-modal-tab="sign-up">Register</a></p>
              </div>

            </form>
            <!-- Default form login -->

          </div>
          <!--/.Panel 1-->

          <!--Panel 2-->
          <div class="tab-pane fade active show" id="navbarLogin-signup" role="tabpanel">

            <!-- Default form register  -->
            <form id="register" class="text-center needs-validation" action="register" method="post" name="register-form">

              <!-- Social login -->

              <p class="status"></p>

              <div class="text-center mb-3">
                <div class="wp-social-login-widget">
                    <div class="wp-social-login-connect-with">Connect with:</div>
                    <div class="wp-social-login-provider-list">
                        <a rel="nofollow" href="https://mdbootstrap.com/wp-login.php?action=wordpress_social_authenticate&mode=login&provider=Facebook&redirect_to=${encodeURIComponent(
                          location.href
                        )}" title="Connect with Facebook" class="wp-social-login-provider wp-social-login-provider-facebook btn btn-primary btn-floating mx-1 ripple-surface" data-provider="Facebook" role="button" style="min-width: 37px;"><i class="fab fa-facebook-f"></i></a>
                        <a rel="nofollow" href="https://mdbootstrap.com/wp-login.php?action=wordpress_social_authenticate&mode=login&provider=Google&redirect_to=${encodeURIComponent(
                          location.href
                        )}" title="Connect with Google" class="wp-social-login-provider wp-social-login-provider-google btn btn-primary btn-floating mx-1" data-provider="Google" role="button"><i class="fab fa-google"></i></a>
                        <a rel="nofollow" href="https://mdbootstrap.com/wp-login.php?action=wordpress_social_authenticate&mode=login&provider=Twitter&redirect_to=${encodeURIComponent(
                          location.href
                        )}" title="Connect with Twitter" class="wp-social-login-provider wp-social-login-provider-twitter btn btn-primary btn-floating mx-1" data-provider="Twitter" role="button"><i class="fab fa-twitter"></i></a>
                    </div>
                </div>
              </div>
              <!-- Social login -->

              <p class="text-center">or:</p>

              <!-- Name input -->
              <div data-mdb-input-init class="form-outline form-auth-mdb mb-4">
                <input type="text" id="signonname" class="form-control" name="signonname" required minlength="3">
                <label for="signonname" class="form-label">Your name</label>
                <div class="invalid-feedback">Please provide a valid name.</div>
              </div>

              <!-- Username input -->
              <div data-mdb-input-init class="form-outline form-auth-mdb mb-4">
                <input type="text" id="signonusername" class="form-control" name="signonusername" required minlength="3">
                <label for="signonusername" class="form-label">Your username</label>
                <div class="invalid-feedback">Please provide a valid username.</div>
              </div>

              <!-- Email input -->
              <div data-mdb-input-init class="form-outline form-auth-mdb mb-4">
                <input type="email" id="signonemail" class="form-control" name="email" required>
                <label for="email" class="form-label">Your email</label>
                <div class="invalid-feedback">Please provide a valid email.</div>
              </div>

              <!-- Password input -->
              <div data-mdb-input-init class="form-outline form-auth-mdb mb-4">
                <input type="password" id="signonpassword" class="form-control" name="signonpassword" autocomplete="off" required minlength="5">
                <label for="signonpassword" class="form-label">Your password</label>
                <div class="invalid-feedback">Please provide a valid password.</div>
              </div>

              <!-- Repeat Password input -->
              <div data-mdb-input-init class="form-outline form-auth-mdb mb-4">
                <input type="password" id="password2" class="form-control" name="password2" autocomplete="off" required minlength="5">
                <label for="password2" class="form-label">Repeat password</label>
                <div id="repeat-password-feedback" class="invalid-feedback">Please repeat the password.</div>
              </div>

               <!-- Subscribe checkbox -->
              <div class="form-check d-flex justify-content-center">
                <input type="checkbox" class="form-check-input me-1" id="newsletter" name="newsletter" value="subscribe">
                <label class="form-check-label" for="newsletter">I agree to sign up for MDB account notifications and newsletter</label>
              </div>

              <!-- Subscribe checkbox -->

              <div class="form-text text-center small text-muted mb-4">
                By signing up you agree to data processing by the administrator: StartupFlow s.c. located in Kijowska 7, Warsaw. The administrator processes data following the <a target="_blank" href="https://mdbootstrap.com/privacy-policy/">Privacy Policy</a>.
              </div>

              <button class="btn btn-primary btn-block mb-3" id="AJAXAuthRegisterBtn" type="submit" value="SIGNUP">
                Sign up
              </button>

            </form>
            <!-- Default form register  -->

          </div>
          <!--/.Panel 2-->

        </div>
        <!-- Pills panels -->

      </div>
      <!-- Modal footer -->
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-mdb-dismiss="modal">
          Close
        </button>
      </div>
    </div>
    <!-- Modal content -->
  </div>
</div>`;
  },
  mounted() {
    if (window.mdb !== undefined && typeof mdb !== 'undefined') {
      document.querySelectorAll('.form-auth-mdb').forEach((formOutline) => new mdb.Input(formOutline).init());
      document.querySelectorAll('[data-mdb-pill-init]').forEach((tab) => mdb.Tab.getOrCreateInstance(tab));
    }
  },
});
