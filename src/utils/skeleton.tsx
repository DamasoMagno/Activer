import { Skeleton } from "@chakra-ui/react";

type SkeletonEffectProps = {
  localStorageName: string;
}

export function SkeletonEffect({ localStorageName }: SkeletonEffectProps) {
  const lastQuantityOfData = [];
  const quantityData = localStorage.getItem(`@${localStorageName}`);
  
  for (let i = 0; i < Number(quantityData); i++) {
    lastQuantityOfData.push(i);
  }
  
  return lastQuantityOfData.map(size =>
  (
    <Skeleton
      h="40px"
      mb=".5rem"
      _last={{
        marginBottom: "0"
      }}
      key={size}
      startColor="rgba(116, 116, 254, .5)"
      endColor="rgba(116, 116, 254, 1)"
    />
  )
  );
}