import React from 'react';
import {Modal, View, Pressable, Text} from 'react-native';
import {styles} from './CameraModal.styles';
import {icons} from '../../../../constants';
interface CameraModalProps {
  visible: boolean;
  onClose: () => void;
  onLaunchCamera: () => void;
  onLaunchImageLibrary: () => void;
}

const CameraModal: React.FC<CameraModalProps> = ({
  visible,
  onClose,
  onLaunchCamera,
  onLaunchImageLibrary,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}>
      <Pressable style={styles.background} onPress={onClose}>
        <View style={styles.whiteBox}>
          <View style={styles.titleBox}>
            <icons.camera height={24} width={24} />
            <Text style={styles.titleBoxText}>사진으로 메뉴를 등록할까요?</Text>
          </View>
          <Pressable
            style={[styles.actionButton, styles.camera]}
            android_ripple={{color: '#eee'}}
            onPress={() => {
              onLaunchCamera();
              onClose();
            }}>
            <Text style={styles.actionText}>사진촬영</Text>
          </Pressable>
          <Pressable
            style={[styles.actionButton, styles.gallery]}
            android_ripple={{color: '#eee'}}
            onPress={() => {
              onLaunchImageLibrary();
              onClose();
            }}>
            <Text style={styles.actionText}>갤러리에서 사진선택</Text>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
};

export default CameraModal;
