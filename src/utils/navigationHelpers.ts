// Copyright 2015-2020 Parity Technologies (UK) Ltd.
// This file is part of Parity.

// Parity is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Parity is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with Parity.  If not, see <http://www.gnu.org/licenses/>.

import { CommonActions } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { Identity } from 'types/identityTypes';
import { RootStackParamList } from 'types/routes';

export type GenericNavigationProps<
	RouteName extends keyof RootStackParamList
> = StackNavigationProp<RootStackParamList, RouteName>;

export const setPin = async <RouteName extends keyof RootStackParamList>(
	navigation: GenericNavigationProps<RouteName>
): Promise<string> =>
	new Promise(resolve => {
		navigation.navigate('PinNew', { resolve });
	});

export const unlockAndReturnSeed = async <
	RouteName extends keyof RootStackParamList
>(
	navigation: GenericNavigationProps<RouteName>
): Promise<string> =>
	new Promise(resolve => {
		navigation.navigate('PinUnlock', {
			resolve,
			shouldReturnSeed: true
		});
	});

export const unlockSeedPhrase = async <
	RouteName extends keyof RootStackParamList
>(
	navigation: GenericNavigationProps<RouteName>,
	isSeedRefValid: boolean,
	identity?: Identity
): Promise<void> =>
	new Promise(resolve => {
		if (isSeedRefValid) {
			resolve();
		} else {
			navigation.navigate('PinUnlock', {
				identity,
				resolve,
				shouldReturnSeed: false
			});
		}
	});

export const unlockSeedPhraseWithPassword = async <
	RouteName extends keyof RootStackParamList
>(
	navigation: GenericNavigationProps<RouteName>,
	isSeedRefValid: boolean,
	identity?: Identity
): Promise<string> =>
	new Promise(resolve => {
		navigation.navigate('PinUnlockWithPassword', {
			identity,
			isSeedRefValid,
			resolve
		});
	});

export const navigateToPathDetails = <
	RouteName extends keyof RootStackParamList
>(
	navigation: GenericNavigationProps<RouteName>,
	networkKey: string,
	path: string
): void => {
	const resetAction = CommonActions.reset({
		index: 2,
		routes: [
			{
				name: 'Main',
				params: { isNew: false }
			},
			{
				name: 'PathsList',
				params: { networkKey }
			},
			{
				name: 'PathDetails',
				params: { path }
			}
		]
	});
	navigation.dispatch(resetAction);
};

export const navigateToLandingPage = <
	RouteName extends keyof RootStackParamList
>(
	navigation: GenericNavigationProps<RouteName>
): void => {
	const resetAction = CommonActions.reset({
		index: 0,
		routes: [{ name: 'Main' }]
	});
	navigation.dispatch(resetAction);
};

export const navigateToNewIdentityNetwork = <
	RouteName extends keyof RootStackParamList
>(
	navigation: GenericNavigationProps<RouteName>
): void => {
	const resetAction = CommonActions.reset({
		index: 0,
		routes: [
			{
				name: 'Main',
				params: { isNew: true }
			}
		]
	});
	navigation.dispatch(resetAction);
};

export const resetNavigationTo = <RouteName extends keyof RootStackParamList>(
	navigation: GenericNavigationProps<RouteName>,
	screenName: string,
	params?: any
): void => {
	const resetAction = CommonActions.reset({
		index: 0,
		routes: [{ name: screenName, params }]
	});
	navigation.dispatch(resetAction);
};

export const resetNavigationWithNetworkChooser = <
	RouteName extends keyof RootStackParamList
>(
	navigation: GenericNavigationProps<RouteName>,
	screenName: string,
	params: object = {},
	isNew = false
): void => {
	const resetAction = CommonActions.reset({
		index: 1,
		routes: [
			{
				name: 'Main',
				params: { isNew }
			},
			{
				name: screenName,
				params: params
			}
		]
	});
	navigation.dispatch(resetAction);
};

export const navigateToSignedMessage = <
	RouteName extends keyof RootStackParamList
>(
	navigation: GenericNavigationProps<RouteName>
): void =>
	resetNavigationWithNetworkChooser(navigation, 'SignedMessage', {
		isNew: true
	});

export const navigateToSignedTx = <RouteName extends keyof RootStackParamList>(
	navigation: GenericNavigationProps<RouteName>
): void =>
	resetNavigationWithNetworkChooser(navigation, 'SignedTx', { isNew: true });

export const navigateToPathsList = <RouteName extends keyof RootStackParamList>(
	navigation: GenericNavigationProps<RouteName>,
	networkKey: string
): void =>
	resetNavigationWithNetworkChooser(navigation, 'PathsList', { networkKey });

export const navigateToQrScanner = <RouteName extends keyof RootStackParamList>(
	navigation: GenericNavigationProps<RouteName>
): void => resetNavigationWithNetworkChooser(navigation, 'QrScanner');

export const navigateToLegacyAccountList = <
	RouteName extends keyof RootStackParamList
>(
	navigation: GenericNavigationProps<RouteName>
): void => resetNavigationTo(navigation, 'LegacyAccountList');

export const navigateToPathDerivation = async <
	RouteName extends keyof RootStackParamList
>(
	navigation: GenericNavigationProps<RouteName>,
	parentPath: string,
	isSeedRefValid: boolean
): Promise<void> => {
	if (!isSeedRefValid) {
		await unlockSeedPhrase(navigation, isSeedRefValid);
	}
	navigation.navigate('PathDerivation', { parentPath });
};
