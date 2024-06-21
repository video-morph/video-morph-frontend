import { FiUploadCloud } from "react-icons/fi";
import { LuFileSymlink } from "react-icons/lu";
import { MdClose } from "react-icons/md";
import ReactDropzone from "react-dropzone";
import bytesToSize from "../../utils/bytes-sizing";
import fileToIcon from "../../utils/file-icon";
import { useState, useEffect, useRef } from "react";
import { useToast } from "../ui/use-toast";
import compressFileName from "../../utils/compress-file";
import { Skeleton } from "../ui/skeleton";
import convertFile from "../../utils/conversion";
import { ImSpinner3 } from "react-icons/im";
import { MdDone } from "react-icons/md";
import { Badge } from "../ui/badge";
import { HiOutlineDownload } from "react-icons/hi";
import { BiError } from "react-icons/bi";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import loadFfmpeg from "../../utils/ffmpeg-loader";
import { FFmpeg } from "@ffmpeg/ffmpeg";

const videoExtensions = [
  "mp4",
  "m4v",
  "mp4v",
  "3gp",
  "3g2",
  "avi",
  "mov",
  "wmv",
  "mkv",
  "flv",
  "ogv",
  "webm",
  "h264",
  "264",
  "hevc",
  "265",
];

const Dropzone = () => {
  const { toast } = useToast();
  const [isHover, setIsHover] = useState(false);
  const [actions, setActions] = useState([]);
  const [isReady, setIsReady] = useState(false);
  const [files, setFiles] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const ffmpegRef = useRef(null);
  const [defaultValues, setDefaultValues] = useState("video");
  const [selected, setSelected] = useState("...");
  const acceptedFiles = {
    "video/*": videoExtensions.map(ext => `.${ext}`),
  };

  const reset = () => {
    setIsDone(false);
    setActions([]);
    setFiles([]);
    setIsReady(false);
    setIsConverting(false);
  };

  const downloadAll = () => {
    actions.forEach(action => {
      if (!action.isError) download(action);
    });
  };

  const download = (action) => {
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = action.url;
    a.download = action.output;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(action.url);
    document.body.removeChild(a);
  };

  const convert = async () => {
    let tmpActions = actions.map(elt => ({ ...elt, isConverting: true }));
    setActions(tmpActions);
    setIsConverting(true);
    for (let action of tmpActions) {
      try {
        const { url, output } = await convertFile(ffmpegRef.current, action);
        tmpActions = tmpActions.map(elt =>
          elt === action
            ? {
                ...elt,
                isConverted: true,
                isConverting: false,
                url,
                output,
              }
            : elt
        );
        setActions(tmpActions);
      } catch (err) {
        tmpActions = tmpActions.map(elt =>
          elt === action
            ? {
                ...elt,
                isConverted: false,
                isConverting: false,
                isError: true,
              }
            : elt
        );
        setActions(tmpActions);
      }
    }
    setIsDone(true);
    setIsConverting(false);
  };

  const handleUpload = (data) => {
    handleExitHover();
    setFiles(data);
    const tmp = [];
    data.forEach(file => {
      tmp.push({
        fileName: file.name,
        fileSize: file.size,
        from: file.name.slice(((file.name.lastIndexOf(".") - 1) >>> 0) + 2),
        to: null,
        fileType: file.type,
        file,
        isConverted: false,
        isConverting: false,
        isError: false,
      });
    });
    setActions(tmp);
  };

  const handleHover = () => setIsHover(true);
  const handleExitHover = () => setIsHover(false);

  const updateAction = (fileName, to) => {
    setActions(
      actions.map(action =>
        action.fileName === fileName
          ? { ...action, to }
          : action
      )
    );
  };

  const checkIsReady = () => {
    let tmpIsReady = true;
    actions.forEach(action => {
      if (!action.to) tmpIsReady = false;
    });
    setIsReady(tmpIsReady);
  };

  const deleteAction = (action) => {
    setActions(actions.filter(elt => elt !== action));
    setFiles(files.filter(elt => elt.name !== action.fileName));
  };

  useEffect(() => {
    if (!actions.length) {
      setIsDone(false);
      setFiles([]);
      setIsReady(false);
      setIsConverting(false);
    } else {
      checkIsReady();
    }
  }, [actions]);

  const load = async () => {
    try {
      const ffmpegResponse = await loadFfmpeg();
      if (ffmpegResponse instanceof FFmpeg) {
        ffmpegRef.current = ffmpegResponse;
        setIsLoaded(true);
      } else {
        throw new Error("Loaded module is not an instance of FFmpeg");
      }
    } catch (error) {
      console.error("Error loading FFmpeg:", error);
      setIsLoaded(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (actions.length) {
    return (
      <div className="space-y-6">
        {actions.map((action, i) => (
          <div
            key={i}
            className="w-full py-4 space-y-2 lg:py-0 relative cursor-pointer rounded-xl border h-fit lg:h-20 px-4 lg:px-10 flex flex-wrap lg:flex-nowrap items-center justify-between"
          >
            {!isLoaded && (
              <Skeleton className="h-full w-full -ml-10 cursor-progress absolute rounded-xl" />
            )}
            <div className="flex gap-4 items-center">
              <span className="text-2xl text-orange-600">
                {fileToIcon(action.fileType)}
              </span>
              <div className="flex items-center gap-1 w-96">
                <span className="text-md font-medium overflow-x-hidden">
                  {compressFileName(action.fileName)}
                </span>
                <span className="text-muted-foreground text-sm">
                  ({bytesToSize(action.fileSize)})
                </span>
              </div>
            </div>

            {action.isError ? (
              <Badge variant="destructive" className="flex gap-2">
                <span>Error Converting File</span>
                <BiError />
              </Badge>
            ) : action.isConverted ? (
              <Badge variant="default" className="flex gap-2 bg-green-500">
                <span>Done</span>
                <MdDone />
              </Badge>
            ) : action.isConverting ? (
              <Badge variant="default" className="flex gap-2">
                <span>Converting</span>
                <span className="animate-spin">
                  <ImSpinner3 />
                </span>
              </Badge>
            ) : (
              <div className="text-muted-foreground text-md flex items-center gap-4">
                <span>Convert to</span>
                <Select
                  onValueChange={value => {
                    setSelected(value);
                    updateAction(action.fileName, value);
                  }}
                  value={selected}
                >
                  <SelectTrigger className="w-32 outline-none focus:outline-none focus:ring-0 text-center text-muted-foreground bg-background text-md font-medium">
                    <SelectValue placeholder="..." />
                  </SelectTrigger>
                  <SelectContent className="h-fit">
                    <Tabs defaultValue={defaultValues} className="w-full">
                      <TabsList className="w-full">
                        <TabsTrigger value="video" className="w-full">
                          Video
                        </TabsTrigger>
                      </TabsList>
                      <TabsContent value="video">
                        <div className="grid grid-cols-3 gap-2 w-fit">
                          {videoExtensions.map((elt, i) => (
                            <div key={i} className="col-span-1 text-center">
                              <SelectItem value={elt} className="mx-auto">
                                {elt}
                              </SelectItem>
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </SelectContent>
                </Select>
              </div>
            )}

            {action.isConverted ? (
              <Button variant="outline" onClick={() => download(action)}>
                Download
              </Button>
            ) : (
              <span
                onClick={() => deleteAction(action)}
                className="absolute top-3 right-3 lg:top-auto lg:bottom-1 lg:right-1 rounded-full cursor-pointer bg-muted-foreground/10 p-2 transition hover:bg-muted-foreground/20 flex items-center justify-center text-2xl text-foreground"
              >
                <MdClose />
              </span>
            )}
          </div>
        ))}
        <div className="flex w-full justify-end">
          {isDone ? (
            <div className="space-y-4 w-fit">
              <Button
                size="lg"
                className="rounded-xl font-semibold relative py-4 text-md flex gap-2 items-center w-full"
                onClick={downloadAll}
              >
                {actions.length > 1 ? "Download All" : "Download"}
                <HiOutlineDownload />
              </Button>
              <Button
                size="lg"
                onClick={reset}
                variant="outline"
                className="rounded-xl"
              >
                Convert Another File(s)
              </Button>
            </div>
          ) : (
            <Button
              size="lg"
              disabled={!isReady || isConverting}
              className="rounded-xl font-semibold relative py-4 text-md flex items-center w-44"
              onClick={convert}
            >
              {isConverting ? (
                <span className="animate-spin text-lg">
                  <ImSpinner3 />
                </span>
              ) : (
                <span>Convert Now</span>
              )}
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <ReactDropzone
        onDrop={handleUpload}
        onDragEnter={handleHover}
        onDragLeave={handleExitHover}
        accept={acceptedFiles}
        onDropRejected={() => {
          handleExitHover();
          toast({
            variant: "destructive",
            title: "Error uploading your file(s)",
            description: "Allowed Files: Videos.",
            duration: 5000,
          });
        }}
        onError={() => {
          handleExitHover();
          toast({
            variant: "destructive",
            title: "Error uploading your file(s)",
            description: "Allowed Files: Videos.",
            duration: 5000,
          });
        }}
      >
        {({ getRootProps, getInputProps }) => (
          <div
            {...getRootProps()}
            className="bg-background h-72 lg:h-80 xl:h-96 rounded-3xl shadow-sm border-secondary border-2 border-dashed cursor-pointer flex items-center justify-center"
          >
            <input {...getInputProps()} />
            <div className="space-y-4 text-foreground">
              {isHover ? (
                <>
                  <div className="justify-center flex text-6xl">
                    <LuFileSymlink />
                  </div>
                  <h3 className="text-center font-medium text-2xl">
                    Yes, right there
                  </h3>
                </>
              ) : (
                <>
                  <div className="justify-center flex text-6xl">
                    <FiUploadCloud />
                  </div>
                  <h3 className="text-center font-medium text-2xl">
                    Click, or drop your files here
                  </h3>
                </>
              )}
            </div>
          </div>
        )}
      </ReactDropzone>
    </div>
  );
};

export default Dropzone;
