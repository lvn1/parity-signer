// Copyright 2015-2019 Parity Technologies (UK) Ltd.
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

'use strict';

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Subscribe } from 'unstated';

import colors from '../colors';
import AccountIconChooser from '../components/AccountIconChooser';
import Background from '../components/Background';
import Button from '../components/Button';
import DerivationPathField from '../components/DerivationPathField'
import KeyboardScrollView from '../components/KeyboardScrollView';
import NetworkButton from '../components/NetworkButton';
import TextInput from '../components/TextInput';
import { NETWORK_LIST, NetworkProtocols } from '../constants';
import fonts from '../fonts';
import AccountsStore from '../stores/AccountsStore';
import { empty, validateSeed } from '../util/account';
import {constructSURI} from '../util/suri';

export default class AccountNew extends React.Component {
	static navigationOptions = {
		title: 'New Account',
		headerBackTitle: 'Back'
	};
	render() {
		return (
			<Subscribe to={[AccountsStore]}>
				{accounts => <AccountNewView {...this.props} accounts={accounts} />}
			</Subscribe>
		);
	}
}

class AccountNewView extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			derivationPassword: '',
			derivationPath: '',
			isDerivationPathValid: true,
			selectedAccount: undefined,
			selectedNetwork: undefined,
		};
	}

	componentDidMount(): void {
		const { accounts } = this.props;
		accounts.updateNew(accounts.getSelected());
	}

	componentWillUnmount = function() {
		// called when the user goes back, or finishes the whole process
		this.props.accounts.updateNew(empty());
	};

	render() {
		const { accounts, navigation } = this.props;
		const { derivationPassword, derivationPath, isDerivationPathValid } = this.state;
		const selectedAccount = accounts.getSelected();
		const {address, name, seed, seedPhrase, validBip39Seed, networkKey} = selectedAccount;

		if (!selectedAccount) {
			return null;
		}

		return (
			<View style={styles.body}>
				<KeyboardScrollView style={{ padding: 20 }}>
					<Background />
					<View style={styles.top}>
						<Text style={styles.titleTop}>DERIVE ACCOUNT</Text>
						<Text style={styles.title}>NAME</Text>
						<TextInput
							onChangeText={name => accounts.updateNew({ name })}
							value={name}
							placeholder="Enter a new account name"
						/>
						<DerivationPathField
							onChange = { ({derivationPassword, derivationPath, isDerivationPathValid}) => {
								this.setState({ derivationPath, derivationPassword, isDerivationPathValid });
							}}
							styles={styles}
						/>
					</View>
					<View style={styles.bottom}>
						<Text style={styles.hintText}>
							Next, you will be asked to backup your account, get a pen and some paper.
						</Text>
						<Button
							buttonStyles={styles.nextStep}
							title="Next Step"
							disabled={!validateSeed(seed, validBip39Seed).valid || !isDerivationPathValid}
							onPress={() => {
								validateSeed(seed, validBip39Seed).valid &&
								navigation.navigate('AccountBackup', {
									isNew: true,
									isWelcome: navigation.getParam('isWelcome')
								});
							}}
						/>
					</View>
				</KeyboardScrollView>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	body: {
		backgroundColor: colors.bg,
		flex: 1,
		overflow: 'hidden'
	},
	top: {
		flex: 1
	},
	bottom: {
		flexBasis: 50,
		paddingBottom: 15
	},
	title: {
		fontFamily: fonts.bold,
		color: colors.bg_text_sec,
		fontSize: 18,
		paddingBottom: 20
	},
	titleTop: {
		color: colors.bg_text_sec,
		fontFamily: fonts.bold,
		fontSize: 24,
		paddingBottom: 20,
		textAlign: 'center'
	},
	hintText: {
		fontFamily: fonts.bold,
		textAlign: 'center',
		paddingTop: 20,
		color: colors.bg_text_sec,
		fontSize: 12
	},
	nextStep: {
		marginTop: 15
	}
});