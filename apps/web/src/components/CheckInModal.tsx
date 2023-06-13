import { ExternalLinkIcon } from "@chakra-ui/icons";
import {
  Button,
  Checkbox,
  Code,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  OrderedList,
  Text,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";

export function CheckInModal({
  id,
  isOpen,
  onClose,
}: {
  id: string;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [noVpn, setNoVpn] = useState<boolean>(false);
  const link = useMemo(() => {
    const timestamp = new Date().getTime() + 7200000;
    if (noVpn) {
      return `http://ekty.cuit.edu.cn/#/pages/activity/studentQdqt?id=${id}&timestamp=${timestamp}`;
    }
    return `http://ekty-cuit-edu-cn.webvpn.cuit.edu.cn:8118/#/pages/activity/studentQdqt?id=${id}&timestamp=${timestamp}`;
  }, [id, noVpn]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>签到</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <Checkbox
            colorScheme="teal"
            checked={noVpn}
            onChange={() => setNoVpn((prev) => !prev)}
          >
            我可以访问 <Code>ekt.cuit.edu.cn</Code>
          </Checkbox>

          <OrderedList my={4}>
            <ListItem>
              <Text>
                确保你已经
                <Link
                  ml={1}
                  href={
                    noVpn
                      ? "//ekt-cuit-edu-cn.webvpn.cuit.edu.cn:8118/api/mSsoLogin"
                      : "//ekt.cuit.edu.cn"
                  }
                  color="teal"
                  isExternal
                >
                  登陆第二课堂
                  <ExternalLinkIcon ml={1} />
                </Link>
              </Text>
            </ListItem>

            <ListItem>打开或复制签到链接</ListItem>
          </OrderedList>

          <InputGroup>
            <Input
              pr="4.5rem"
              placeholder="Enter password"
              readOnly={true}
              value={link}
            />
            <InputRightElement width="4rem">
              <Button
                h="1.75rem"
                size="sm"
                onClick={() => window.open(link, "_blank")}
              >
                打开
              </Button>
            </InputRightElement>
          </InputGroup>
        </ModalBody>

        <ModalFooter>
          <Button size="sm" colorScheme="teal" onClick={onClose}>
            关闭
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
