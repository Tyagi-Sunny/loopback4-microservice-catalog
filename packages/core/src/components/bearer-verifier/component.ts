import {Binding, Component, inject, ProviderMap} from '@loopback/core';
import {Strategies} from 'loopback4-authentication';

import {
  BearerVerifierBindings,
  BearerVerifierConfig,
  BearerVerifierType,
} from './keys';
import {FacadesBearerTokenVerifyProvider} from './providers/facades-bearer-token-verify.provider';
import {ServicesBearerTokenVerifyProvider} from './providers/services-bearer-token-verify.provider';
import {AuthenticationServiceProvider} from './services';
import {AuthServiceDataSource} from './datasources';

export class BearerVerifierComponent implements Component {
  constructor(
    @inject(BearerVerifierBindings.Config)
    private readonly config: BearerVerifierConfig,
  ) {
    this.bindings.push(
      Binding.bind('datasources.AuthService').toClass(AuthServiceDataSource),
    );
    this.providers = {
      'services.AuthenticationService': AuthenticationServiceProvider,
    };

    if (this.config && this.config.type === BearerVerifierType.service) {
      this.providers[
        Strategies.Passport.BEARER_TOKEN_VERIFIER.key
      ] = ServicesBearerTokenVerifyProvider;
    } else if (this.config && this.config.type === BearerVerifierType.facade) {
      this.providers[
        Strategies.Passport.BEARER_TOKEN_VERIFIER.key
      ] = FacadesBearerTokenVerifyProvider;
    } else {
      console.error('Invalid BearerVerifierType specified !');
    }
  }
  providers?: ProviderMap;
  bindings: Binding[] = [];
}
