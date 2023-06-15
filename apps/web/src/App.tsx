import { Card, CardBody, Container, Heading } from "@chakra-ui/react";
import { ActivityList } from "./components/ActivityList";

function App() {
  return (
    <>
      <Container
        maxW={1200}
        display="flex"
        flexDirection="column"
        py="10vh"
        gap={8}
      >
        <Card>
          <CardBody>
            <Heading fontWeight="light" size="lg">
              EKT Check-in
            </Heading>
          </CardBody>
        </Card>

        <ActivityList />
      </Container>
    </>
  );
}

export default App;
