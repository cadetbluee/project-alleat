import React from 'react';
import {View, Text} from 'react-native';
import {styles} from './TransactionItem.styles';

interface Transaction {
  id: number;
  amount: number;
  record: boolean;
  restaurant: {
    id: number;
    restaurantsName: string;
    restaurantsType: string;
  };
  mealpay: any;
  transaction_type: number;
  transaction_date: string;
}

interface TransactionItemProps {
  transaction: Transaction;
}

const TransactionItem: React.FC<TransactionItemProps> = ({transaction}) => {
  return (
    <View style={styles.transactionItem}>
      <View style={styles.transactionTitle}>
        <Text style={styles.transactionDetailTitle}>
          {transaction.restaurant.restaurantsName !== 'ALL EAT'
            ? transaction.restaurant.restaurantsName
            : '올잇페이'}
        </Text>
        <Text style={styles.transactionDetailTitle}>
          {transaction.amount > 0
            ? `+${transaction.amount.toLocaleString()}₩`
            : `-${Math.abs(transaction.amount).toLocaleString()}₩`}
        </Text>
      </View>
      <View style={styles.transactionDetails}>
        <Text style={styles.transactionDetailText}>
          {new Date(transaction.transaction_date).toLocaleTimeString('it-IT', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          })}{' '}
          |{' '}
        </Text>
        <Text style={styles.transactionDetailText}>
          {transaction.restaurant.restaurantsName === 'ALL EAT' &&
          transaction.transaction_type === 0
            ? '충전'
            : transaction.restaurant.restaurantsName !== 'ALL EAT' &&
              transaction.transaction_type === 1
            ? '소비'
            : '송금'}
        </Text>
      </View>
    </View>
  );
};

export default TransactionItem;
