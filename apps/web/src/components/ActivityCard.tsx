import {
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
import { useState } from "react";
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

export function ActivityCard({ activityData }: { activityData: Activity }) {
  const [showDesc, setShowDesc] = useState<boolean>(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

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
                  {activityData.regNum} / {activityData.maxRegNum ?? "∞"}
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
          <CardBody bg="blackAlpha.50">
            <Text whiteSpace="pre-wrap">{`${activityData.desc}`}</Text>
          </CardBody>
        </Collapse>

        <CardBody>
          <Flex gap={2}>
            <Button size="sm" colorScheme="teal" onClick={onOpen}>
              签到
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

      <CheckInModal id={activityData.id} isOpen={isOpen} onClose={onClose} />
    </>
  );
}
