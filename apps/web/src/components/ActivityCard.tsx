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
} from "@chakra-ui/react";
import { Activity } from "@ekt-check-in/types/api";
import { useMemo, useState } from "react";
import { CheckInModal } from "./CheckInModal";
import { RegisterModal } from "./RegisterModal";

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

export function ActivityCard({ activityData }: { activityData: Activity }) {
  const [showDesc, setShowDesc] = useState<boolean>(false);

  const {
    isOpen: isCheckInOpen,
    onOpen: onCheckInOpen,
    onClose: onCheckInClose,
  } = useDisclosure();

  const {
    isOpen: isRegisterOpen,
    onOpen: onRegisterOpen,
    onClose: onRegisterClose,
  } = useDisclosure();

  const isWrongId = useMemo(() => {
    return !/^\d+$/.test(activityData.id);
  }, [activityData.id]);

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
              此活动部分功能不可用，因为第二课堂 API 返回的 ID 有误
            </Alert>
          )}

          <Flex gap={2}>
            <Button
              size="sm"
              colorScheme="teal"
              onClick={onCheckInOpen}
              isDisabled={isWrongId}
            >
              签到
            </Button>
            <Button
              size="sm"
              colorScheme="teal"
              variant="outline"
              onClick={onRegisterOpen}
              isDisabled={isWrongId}
            >
              帮我报名
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
        isOpen={isCheckInOpen}
        onClose={onCheckInClose}
      />

      <RegisterModal
        activityData={activityData}
        isOpen={isRegisterOpen}
        onClose={onRegisterClose}
      />
    </>
  );
}
