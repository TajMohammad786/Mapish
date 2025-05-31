import {useMap} from 'react-leaflet';
import useMapStore from '../store/mapStore';
import { Button } from '@/components/ui/button';

export const LocateButton = () => {
  const map = useMap();
  const {accuracy,position, getZoomLevelByAccuracy} = useMapStore()

  const handleClick = () => {
    const zoom = getZoomLevelByAccuracy(accuracy);
    map.setView(position, zoom);
  };

  return (
    <div className="absolute bottom-7 right-16 z-[1000]">
      <Button
        onClick={handleClick}
        variant="default"
        className="bg-white text-black border border-gray-300 rounded-lg px-4 py-2 shadow-md hover:bg-gray-100 transition"
      >
        📍 Locate Me
      </Button>
    </div>
  );
};

import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import React from 'react';

import { cn } from '@/lib/utils';

const DropdownMenuContent = React.forwardRef(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-[1001] min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
));

DropdownMenuContent.displayName = 'DropdownMenuContent';
