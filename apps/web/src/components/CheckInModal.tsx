import {
  Alert,
  AlertIcon,
  Button,
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
import {
  Activity,
  MyActivity,
  ProxyApiResponse,
} from "@ekt-check-in/types/api";
import dayjs from "dayjs";
import { useContext, useLayoutEffect, useState } from "react";
import { AccountContext } from "./AccountProvider";

export function CheckInModal({
  myActivityData,
  activityData,
  isOpen,
  onClose,
}: {
  myActivityData?: MyActivity;
  activityData: Activity;
  isOpen: boolean;
  onClose: () => void;
}) {
  const { id, password } = useContext(AccountContext);
  const [checkInDate, setCheckInDate] = useState<Date | null>();
  const [checkOutDate, setCheckOutDate] = useState<Date | null>();

  const toast = useToast();

  useLayoutEffect(() => {
    if (!isOpen) {
      return;
    }

    setCheckInDate(new Date(activityData.startTime));
    setCheckOutDate(new Date(activityData.endTime));
  }, [activityData.endTime, activityData.startTime, isOpen]);

  async function handleSubmit() {
    const loading = toast({
      description: "请求中",
      status: "loading",
    });

    const url = new URL(`${webConfig.proxyApi}/edit-check-in-date`);
    url.searchParams.set("id", id);
    url.searchParams.set("password", password);
    url.searchParams.set("activityId", activityData.id);
    url.searchParams.set(
      "checkInDate",
      dayjs(checkInDate).format("YYYY-MM-DDTHH:mm:ss")
    );
    url.searchParams.set(
      "checkOutDate",
      dayjs(checkInDate).format("YYYY-MM-DDTHH:mm:ss")
    );

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
        description: "签到成功",
        status: "success",
      });

      onClose();
    } catch (error) {
      toast.close(loading);

      toast({
        description: "发送签到请求时出现错误",
        status: "error",
      });
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {myActivityData?.isCheckIn && myActivityData?.isCheckOut
            ? "修改签到"
            : "签到"}
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <Flex gap={4} direction="column">
            <Alert status="warning">
              <AlertIcon />
              默认为活动开始和结束时间，可能无法通过审核，请检查
            </Alert>

            <FormControl isRequired>
              <FormLabel>签到时间</FormLabel>
              <Input
                type="datetime-local"
                step="1"
                value={dayjs(checkInDate).format("YYYY-MM-DDTHH:mm:ss")}
                onChange={(e) => setCheckInDate(dayjs(e.target.value).toDate())}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>签退时间</FormLabel>
              <Input
                type="datetime-local"
                step="1"
                value={dayjs(checkOutDate).format("YYYY-MM-DDTHH:mm:ss")}
                onChange={(e) =>
                  setCheckOutDate(dayjs(e.target.value).toDate())
                }
              />
            </FormControl>
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
