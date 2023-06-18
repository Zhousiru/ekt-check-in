import {
  Alert,
  AlertIcon,
  Button,
  Checkbox,
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
  useToast,
} from "@chakra-ui/react";
import { webConfig } from "@ekt-check-in/config";
import { Activity, ProxyApiResponse } from "@ekt-check-in/types/api";
import { useState } from "react";

export function RegisterModal({
  activityData,
  isOpen,
  onClose,
}: {
  activityData: Activity;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [isCustomPassword, setIsCustomPassword] = useState(false);
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  const toast = useToast();

  async function handleSubmit() {
    if (id.length !== 10 || (isCustomPassword && !password)) {
      toast({
        description: "无效的账号或密码",
        status: "error",
        isClosable: true,
      });
      return;
    }

    const loading = toast({
      description: "请求中",
      status: "loading",
    });

    const url = new URL(`${webConfig.proxyApi}/register-activity`);
    url.searchParams.set("id", id);
    url.searchParams.set("password", isCustomPassword ? password : "123456");
    url.searchParams.set("activityId", activityData.id);

    try {
      const res = await fetch(url);
      const data: ProxyApiResponse<null> = await res.json();

      toast.close(loading);

      if (res.status !== 200) {
        toast({
          description: data.msg,
          status: "error",
        });
        return;
      }

      toast({
        description: "报名成功",
        status: "success",
      });

      onClose();
    } catch (error) {
      toast.close(loading);

      toast({
        description: "发送报名请求时出现错误",
        status: "error",
      });
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>报名</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <Flex gap={4} direction="column">
            {activityData.status !== 0 && (
              <Alert status="warning">
                <AlertIcon />
                当前非报名时间，报名可能无法通过审核
              </Alert>
            )}

            <FormControl isRequired>
              <FormLabel>账号</FormLabel>
              <Input
                type="number"
                value={id}
                onChange={(e) => setId(e.target.value)}
              />
            </FormControl>

            <Checkbox
              colorScheme="teal"
              isChecked={isCustomPassword}
              onChange={(e) => setIsCustomPassword(e.target.checked)}
            >
              我修改了第二课堂的默认密码
            </Checkbox>

            {isCustomPassword && (
              <FormControl isRequired={isCustomPassword}>
                <FormLabel>密码</FormLabel>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </FormControl>
            )}
          </Flex>
        </ModalBody>

        <ModalFooter>
          <Flex gap={2}>
            <Button size="sm" colorScheme="teal" onClick={handleSubmit}>
              提交
            </Button>
            <Button size="sm" onClick={onClose}>
              关闭
            </Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
