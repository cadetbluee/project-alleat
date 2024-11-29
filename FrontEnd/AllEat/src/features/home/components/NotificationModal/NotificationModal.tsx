import React from 'react';
import {Modal, View, Pressable, Text} from 'react-native';
import {styles} from './NotificationModal.styles';
import {icons} from '../../../../constants';
interface NotificationModalProps {
  visible: boolean;
  isPlus:boolean;
  isAllEat:boolean;
  body:String;
  onClose: () => void;
}

const NotificationModal: React.FC<NotificationModalProps> = ({
  visible,
  isPlus,
  body,
  onClose,
  isAllEat
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      style={styles.notifyModalBox}>
      <Pressable style={styles.background} onPress={onClose}>
        <View style={styles.whiteBox}>
          <View style={styles.titleBox}>
            <icons.wallet height={24} width={24} />
            {isAllEat && !isPlus && <Text style={styles.titleBoxText}>송금이 완료되었습니다!</Text>}
            {!isAllEat && !isPlus && <Text style={styles.titleBoxText}>결제가 완료되었습니다!</Text>}
            {isPlus && <Text style={styles.titleBoxText}>충전이 완료되었습니다!</Text>}
          </View>
          <View style={styles.contentBox}>
            <Text>{body}</Text>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};

export default NotificationModal;
