import {
  Alert,
  AlertIcon,
  Button,
  Card,
  CardBody,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useContext, useLayoutEffect, useState } from "react";
import { AccountContext } from "./AccountProvider";

export function SettingCard() {
  const [needSetup, setNeedSetup] = useState(false);
  const { id, setId, password, setPassword } = useContext(AccountContext);
  const [tempId, setTempId] = useState(id);
  const [tempPassword, setTempPassword] = useState(password);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const toast = useToast();

  const updateStatus = () => {
    if (!id || !password) {
      setNeedSetup(true);
    } else {
      setNeedSetup(false);
    }
  };

  useLayoutEffect(updateStatus, [id, password]);

  function handleClose() {
    setTempId(id);
    setTempPassword(password);
    onClose();
  }

  function handleSave() {
    if (!tempId || !tempPassword) {
      toast({
        description: "无效的账号或密码",
        status: "error",
        isClosable: true,
      });
      return;
    }

    setId(tempId);
    setPassword(tempPassword);
    onClose();
  }

  return (
    <>
      <Card bg={needSetup ? "orange.100" : "blue.100"}>
        <CardBody display="flex" alignItems="center">
          {needSetup ? (
            <Alert status="warning">
              <AlertIcon />
              你还没有设置第二课堂账户，因此部分功能不可用
            </Alert>
          ) : (
            <Alert status="info">
              <AlertIcon />
              当前账户：{id}
            </Alert>
          )}

          <Button
            colorScheme={needSetup ? "orange" : "blue"}
            variant={needSetup ? "solid" : "outline"}
            onClick={onOpen}
          >
            设置
          </Button>
        </CardBody>
      </Card>

      <Modal isOpen={isOpen} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>设置</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <Flex gap={4} direction="column">
              <FormControl isRequired>
                <FormLabel>账号</FormLabel>
                <Input
                  type="number"
                  value={tempId ?? ""}
                  onChange={(e) => setTempId(e.target.value)}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>密码</FormLabel>
                <Input
                  type="password"
                  value={tempPassword ?? ""}
                  onChange={(e) => setTempPassword(e.target.value)}
                />
              </FormControl>
            </Flex>
          </ModalBody>

          <ModalFooter>
            <Flex gap={2}>
              <Button size="sm" colorScheme="teal" onClick={handleSave}>
                保存
              </Button>
              <Button size="sm" onClick={handleClose}>
                关闭
              </Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
