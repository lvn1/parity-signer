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

import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import KeyboardScrollView from 'components/KeyboardScrollView';
import testIDs from 'e2e/testIDs';
import { NavigationAccountProps } from 'types/props';
import { words } from 'utils/native';
import TouchableItem from 'components/TouchableItem';
import colors from 'styles/colors';
import fontStyles from 'styles/fontStyles';
import ButtonMainAction from 'components/ButtonMainAction';
import { navigateToNewIdentityNetwork, setPin } from 'utils/navigationHelpers';
import { withAccountStore } from 'utils/HOC';
import ScreenHeading from 'components/ScreenHeading';
import {
	alertBackupDone,
	alertCopyBackupPhrase,
	alertIdentityCreationError
} from 'utils/alertUtils';
import Button from 'components/Button';
import { useNewSeedRef } from 'utils/seedRefHooks';

function IdentityBackup({
	navigation,
	accounts,
	route
}: NavigationAccountProps<'IdentityBackup'>): React.ReactElement {
	const [seedPhrase, setSeedPhrase] = useState('');
	const [wordsNumber, setWordsNumber] = useState(12);
	const createSeedRefWithNewSeed = useNewSeedRef();
	const isNew = route.params.isNew ?? false;
	const onBackupDone = async (): Promise<void> => {
		const pin = await setPin(navigation);
		try {
			await accounts.saveNewIdentity(seedPhrase, pin, createSeedRefWithNewSeed);
			setSeedPhrase('');
			navigateToNewIdentityNetwork(navigation);
		} catch (e) {
			alertIdentityCreationError(e.message);
		}
	};

	const renderTextButton = (buttonWordsNumber: number): React.ReactElement => {
		const textStyles =
			wordsNumber === buttonWordsNumber
				? { ...fontStyles.t_codeS, color: colors.label_text }
				: fontStyles.t_codeS;
		return (
			<Button
				buttonStyles={styles.mnemonicSelectionButton}
				textStyles={textStyles}
				title={`${buttonWordsNumber} words`}
				onPress={(): void => setWordsNumber(buttonWordsNumber)}
			/>
		);
	};
	useEffect((): (() => void) => {
		const setSeedPhraseAsync = async (): Promise<void> => {
			if (route.params.isNew) {
				setSeedPhrase(await words(wordsNumber));
			} else {
				setSeedPhrase(route.params.seedPhrase);
			}
		};

		setSeedPhraseAsync();
		return (): void => {
			setSeedPhrase('');
		};
	}, [route.params, wordsNumber]);

	return (
		<KeyboardScrollView style={styles.body}>
			<ScreenHeading
				title={'Recovery Phrase'}
				subtitle={
					' Write these words down on paper. Keep the backup paper safe. These words allow anyone to recover this account and access its funds.'
				}
			/>
			<View />
			{isNew && (
				<View style={styles.mnemonicSelectionRow}>
					{renderTextButton(12)}
					{renderTextButton(24)}
				</View>
			)}
			<TouchableItem
				onPress={(): void => {
					// only allow the copy of the recovery phrase in dev environment
					if (__DEV__) {
						alertCopyBackupPhrase(seedPhrase);
					}
				}}
			>
				<Text
					style={fontStyles.t_seed}
					testID={testIDs.IdentityBackup.seedText}
				>
					{seedPhrase}
				</Text>
			</TouchableItem>
			{isNew && (
				<ButtonMainAction
					title={'Next'}
					testID={testIDs.IdentityBackup.nextButton}
					bottom={false}
					onPress={(): void => alertBackupDone(onBackupDone)}
				/>
			)}
		</KeyboardScrollView>
	);
}

export default withAccountStore(IdentityBackup);

const styles = StyleSheet.create({
	body: {
		padding: 16
	},
	mnemonicSelectionButton: {
		backgroundColor: colors.bg,
		flex: 1,
		height: 30,
		paddingHorizontal: 5,
		paddingVertical: 5
	},
	mnemonicSelectionRow: {
		flexDirection: 'row',
		justifyContent: 'space-around'
	}
});
