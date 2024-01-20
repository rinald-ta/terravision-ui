import Image from 'next/image';

import {
  CollapsibleTrigger,
  CollapsibleContent,
  Collapsible
} from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { firaCode } from './layout';

export default function Page() {
  return (
    <div className="grid h-screen w-full grid-cols-2 gap-4 p-4">
      <div className="flex flex-col h-full border border-gray-200 rounded-lg dark:border-gray-800">
        <div className="px-4 py-2 border-b">
          <h2 className="text-lg font-semibold">Text Editor</h2>
        </div>
        <div className="flex-1 overflow-auto">
          <div className="h-full" />
        </div>
      </div>
      <div className="flex flex-col h-full border border-gray-200 rounded-lg dark:border-gray-800">
        <div className="px-4 py-2 border-b">
          <h2 className="text-lg font-semibold">Output</h2>
        </div>
        <div className="flex-1 overflow-auto">
          <Image
            alt="Output"
            className="mx-auto my-4"
            height="300"
            src="/placeholder.svg"
            style={{
              aspectRatio: '300/300',
              objectFit: 'cover'
            }}
            width="300"
          />
        </div>
        <Collapsible className="border-t">
          <CollapsibleTrigger className="px-4 py-2 cursor-pointer">
            <h3 className="text-lg font-semibold">Console Output</h3>
          </CollapsibleTrigger>
          <CollapsibleContent className="px-4 py-2 bg-gray-800">
            <code className={cn('text-sm text-gray-200', firaCode.className)}>
              Console output goes here...
            </code>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
}
