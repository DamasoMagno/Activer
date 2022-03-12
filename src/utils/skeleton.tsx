import { Skeleton } from "@chakra-ui/react";

export function SkeletonEffect() {
  const lastQuantityOfData = [];
  const quantityData = localStorage.getItem("@lastQuantityActivities");

  for (let i = 0; i < Number(quantityData); i++) {
    lastQuantityOfData.push(i);
  }

  return lastQuantityOfData.map(size =>
  (
    <Skeleton
      h="40px"
      my={4}
      key={size}
      startColor="rgba(116, 116, 254, .5)"
      endColor="rgba(116, 116, 254, 1)"
    />
  )
  );
}