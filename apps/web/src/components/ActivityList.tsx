import {
  Card,
  CardBody,
  Code,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import { webConfig } from "@ekt-check-in/config";
import {
  Activity,
  MyActivity,
  ProxyApiResponse,
} from "@ekt-check-in/types/api";
import {
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import useSWR from "swr";
import { AccountContext } from "./AccountProvider";
import { ActivityCard } from "./ActivityCard";

export interface ActivityListRef {
  refeshMyActivity: () => void;
}

function ErrorCard({ data }: { data?: ProxyApiResponse<Activity[]> }) {
  return (
    <Card h="50vh">
      <CardBody
        display="flex"
        flexDir="column"
        alignItems="center"
        justifyContent="center"
        gap={2}
      >
        <Text>无法加载数据</Text>
        {data?.msg !== "" && <Code colorScheme="red" children={data?.msg} />}
      </CardBody>
    </Card>
  );
}

export const ActivityList = forwardRef<ActivityListRef>((_, ref) => {
  const toast = useToast();

  const { id, password } = useContext(AccountContext);
  const [myActivityData, setMyActivityData] = useState<MyActivity[]>([]);

  const refeshMyActivity = useCallback(async () => {
    const myActivityUrl = new URL(
      `${webConfig.proxyApi}/request-my-activities`
    );
    myActivityUrl.searchParams.set("id", id);
    myActivityUrl.searchParams.set("password", password);

    try {
      const res = await fetch(myActivityUrl);
      const data: ProxyApiResponse<MyActivity[]> = await res.json();

      if (res.status !== 200) {
        toast({
          description: data.msg,
          status: "error",
        });
        return;
      }

      setMyActivityData(data.payload);
    } catch (error) {
      console.error(error);
      toast({
        description: "请求个人活动时出现错误",
        status: "error",
      });
    }
  }, [id, password, toast]);

  useImperativeHandle(
    ref,
    () => {
      return {
        refeshMyActivity,
      };
    },
    [refeshMyActivity]
  );

  useEffect(() => {
    if (id && password) {
      refeshMyActivity();
    }
  }, [id, password, refeshMyActivity]);

  const fetcher = (url: string) => fetch(url).then((res) => res.json());

  const { data, error, isLoading } = useSWR<ProxyApiResponse<Activity[]>>(
    `${webConfig.proxyApi}/request-activities`,
    fetcher
  );

  if (error) return <ErrorCard />;

  if (isLoading)
    return (
      <Card h="50vh">
        <CardBody display="flex" alignItems="center" justifyContent="center">
          <Spinner
            speed="0.65s"
            emptyColor="gray.200"
            color="teal.500"
            size="lg"
          />
        </CardBody>
      </Card>
    );

  if (!data?.payload) {
    return <ErrorCard data={data} />;
  }

  return (
    <>
      {data.payload.map((activity) => (
        <ActivityCard
          handleRefresh={refeshMyActivity}
          activityData={activity}
          myActivityData={myActivityData.find(
            (el) => el.activityId === activity.id
          )}
          key={activity.id + activity.name}
        />
      ))}
    </>
  );
});
