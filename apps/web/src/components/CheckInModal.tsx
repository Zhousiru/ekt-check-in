import { ExternalLinkIcon } from "@chakra-ui/icons";
import {
  Alert,
  AlertIcon,
  Button,
  Checkbox,
  Code,
  Flex,
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
import { Activity } from "@ekt-check-in/types/api";
import { useEffect, useState } from "react";

export function CheckInModal({
  activityData,
  isOpen,
  onClose,
}: {
  activityData: Activity;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [noVpn, setNoVpn] = useState<boolean>(false);
  const [link, setLink] = useState<string>("");
  const [isInActivity, setIsInActivity] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const nowTimestamp = new Date().getTime();
    const linkTimestamp = nowTimestamp + 7200000;
    if (noVpn) {
      setLink(
        `http://ekty.cuit.edu.cn/#/pages/activity/studentQdqt?id=${activityData.id}&timestamp=${linkTimestamp}`
      );
    } else {
      setLink(
        `http://ekty-cuit-edu-cn.webvpn.cuit.edu.cn:8118/#/pages/activity/studentQdqt?id=${activityData.id}&timestamp=${linkTimestamp}`
      );
    }

    const startTimestamp = new Date(activityData.startTime).getTime();
    const endTimestamp = new Date(activityData.endTime).getTime();

    if (nowTimestamp >= startTimestamp && nowTimestamp <= endTimestamp) {
      setIsInActivity(true);
    } else {
      setIsInActivity(false);
    }
  }, [
    activityData.endTime,
    activityData.id,
    activityData.startTime,
    isOpen,
    noVpn,
  ]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>签到</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <Flex gap={4} direction="column">
            {isInActivity ? (
              <Alert status="success">
                <AlertIcon />
                当前为活动时间，请检查活动时间是否属实
              </Alert>
            ) : (
              <Alert status="warning">
                <AlertIcon />
                当前非活动时间，签到可能无法通过审核
              </Alert>
            )}

            <Alert status="info">
              <AlertIcon />
              签退按钮在签到按钮的下方，与背景色相同
            </Alert>

            <Checkbox
              colorScheme="teal"
              isChecked={noVpn}
              onChange={(e) => setNoVpn(e.target.checked)}
            >
              我可以访问 <Code>ekt.cuit.edu.cn</Code>
            </Checkbox>

            <OrderedList>
              <ListItem>
                <Text>
                  确保你已经
                  <Link
                    ml={1}
                    href={
                      noVpn
                        ? "http://ekt.cuit.edu.cn/api/mSsoLogin"
                        : "http://ekt-cuit-edu-cn.webvpn.cuit.edu.cn:8118/api/mSsoLogin"
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
                pr="4rem"
                placeholder="Enter password"
                readOnly={true}
                value={link}
                onFocus={(e) => e.target.select()}
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
          </Flex>
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
