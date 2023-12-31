import {
  Alert,
  AlertIcon,
  Badge,
  Button,
  Card,
  CardBody,
  Collapse,
  Flex,
  Heading,
  ListItem,
  Stack,
  StackDivider,
  Text,
  UnorderedList,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { webConfig } from "@ekt-check-in/config";
import {
  Activity,
  MyActivity,
  ProxyApiResponse,
} from "@ekt-check-in/types/api";
import { useContext, useMemo, useState } from "react";
import { AccountContext } from "./AccountProvider";
import { CheckInLinkModal } from "./CheckInLinkModal";
import { CheckInModal } from "./CheckInModal";

function StatusBadge({ status }: { status: number }) {
  const text = ["报名中", "待开始", "进行中", "待完结", "完结审核中", "已完结"];

  if (status > text.length - 1) {
    return <Badge>未知状态</Badge>;
  }

  if (status === 0) {
    return <Badge colorScheme="green">{text[status]}</Badge>;
  }

  if (status < 3) {
    return <Badge colorScheme="orange">{text[status]}</Badge>;
  }

  return <Badge colorScheme="blue">{text[status]}</Badge>;
}

export function ActivityCard({
  activityData,
  myActivityData,
  handleRefresh,
}: {
  activityData: Activity;
  myActivityData?: MyActivity;
  handleRefresh: () => void;
}) {
  const [showDesc, setShowDesc] = useState<boolean>(false);

  const {
    isOpen: isCheckInOpen,
    onOpen: onCheckInOpen,
    onClose: onCheckInClose,
  } = useDisclosure();

  const {
    isOpen: isCheckInLinkOpen,
    onOpen: onCheckInLinkOpen,
    onClose: onCheckInLinkClose,
  } = useDisclosure();

  const isWrongId = useMemo(() => {
    return !/^\d+$/.test(activityData.id);
  }, [activityData.id]);

  const isRegistrable = useMemo(() => {
    if (myActivityData) {
      return false;
    }

    if (activityData.maxRegNum) {
      return activityData.regNum < activityData.maxRegNum;
    }
    return true;
  }, [activityData.maxRegNum, activityData.regNum, myActivityData]);

  const { id, password } = useContext(AccountContext);
  const toast = useToast();

  const withRefresh = async (fn: () => Promise<void> | void) => {
    await fn();
    if (id && password) {
      handleRefresh();
    }
  };

  async function handleRegister() {
    const loading = toast({
      description: "请求中",
      status: "loading",
    });

    const url = new URL(`${webConfig.proxyApi}/register-activity`);
    url.searchParams.set("id", id);
    url.searchParams.set("password", password);
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
    } catch (error) {
      toast.close(loading);

      toast({
        description: "请求报名时出现错误",
        status: "error",
      });
    }
  }

  return (
    <>
      <Card>
        <CardBody>
          <Stack divider={<StackDivider />} spacing="4">
            <Flex direction="column" gap={1}>
              <Heading as="h3" size="md">
                {activityData.name}
              </Heading>
              <Flex gap={2}>
                <StatusBadge status={activityData.status} />
                <Badge colorScheme="teal">{activityData.point} 分</Badge>
                <Badge colorScheme="cyan">
                  {activityData.regNum} / {activityData.maxRegNum ?? "∞"} 人
                </Badge>
              </Flex>
              <Text color="GrayText" fontSize="sm">
                {activityData.id}
              </Text>
            </Flex>

            <UnorderedList>
              <ListItem>
                创建时间：{activityData.createTime.slice(0, -4)}
              </ListItem>
              <ListItem>主办方：{activityData.host}</ListItem>
              <ListItem>
                时间：{activityData.startTime} — {activityData.endTime}
              </ListItem>
              <ListItem>地点：{activityData.addr}</ListItem>
              <ListItem>签到开始时间：{activityData.signTime}</ListItem>
            </UnorderedList>
          </Stack>
        </CardBody>

        <Collapse in={showDesc}>
          <CardBody bg="blackAlpha.50" mb={5}>
            <Text whiteSpace="pre-wrap">{`${activityData.desc}`}</Text>
          </CardBody>
        </Collapse>

        <CardBody pt={0}>
          {isWrongId && (
            <Alert status="error" mb={5}>
              <AlertIcon />
              此活动功能不可用，因为第二课堂 API 返回的 ID 有误
            </Alert>
          )}

          {myActivityData &&
            (myActivityData.isCheckIn && myActivityData.isCheckOut ? (
              <Alert status="success" mb={5}>
                <AlertIcon />
                你已经报名此活动，并成功签到和签退
              </Alert>
            ) : (
              <Alert status="info" mb={5}>
                <AlertIcon />
                你已经报名此活动，但没有
                {!myActivityData.isCheckIn && !myActivityData.isCheckOut
                  ? "签到和签退"
                  : !myActivityData.isCheckIn
                  ? "签到"
                  : "签退"}
              </Alert>
            ))}

          <Flex gap={2}>
            <Button
              size="sm"
              colorScheme="teal"
              onClick={() => withRefresh(handleRegister)}
              isDisabled={isWrongId || !isRegistrable || !id || !password}
            >
              报名
            </Button>
            <Button
              size="sm"
              colorScheme="teal"
              variant={
                myActivityData?.isCheckIn && myActivityData?.isCheckOut
                  ? "outline"
                  : "solid"
              }
              onClick={onCheckInOpen}
              isDisabled={isWrongId || !myActivityData || !id || !password}
            >
              {myActivityData?.isCheckIn && myActivityData?.isCheckOut
                ? "修改签到"
                : "签到"}
            </Button>
            <Button
              size="sm"
              colorScheme="teal"
              variant="outline"
              onClick={onCheckInLinkOpen}
              isDisabled={isWrongId}
            >
              签到链接
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowDesc((prev) => !prev)}
            >
              {showDesc ? "收起" : "展开"}详情
            </Button>
          </Flex>
        </CardBody>
      </Card>

      <CheckInModal
        activityData={activityData}
        myActivityData={myActivityData}
        isOpen={isCheckInOpen}
        onClose={() => withRefresh(onCheckInClose)}
      />
      <CheckInLinkModal
        activityData={activityData}
        isOpen={isCheckInLinkOpen}
        onClose={() => withRefresh(onCheckInLinkClose)}
      />
    </>
  );
}
