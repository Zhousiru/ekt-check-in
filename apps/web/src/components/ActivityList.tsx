import { Card, CardBody, Code, Spinner, Text } from "@chakra-ui/react";
import { webConfig } from "@ekt-check-in/config";
import { Activity, ProxyApiResponse } from "@ekt-check-in/types/api";
import useSWR from "swr";
import { ActivityCard } from "./ActivityCard";

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

export function ActivityList() {
  const { data, error, isLoading } = useSWR<ProxyApiResponse<Activity[]>>(
    `${webConfig.proxyApi}/request-activities`,
    (url) => fetch(url).then((res) => res.json())
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
          activityData={activity}
          key={activity.id + activity.name}
        />
      ))}
    </>
  );
}
