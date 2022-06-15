import app from './app';

app.listen(3333);


// run docker -- postbird

// docker images

// docker run image_name:tag_name

//----------------------------------------------------------------------------------------------------------//

// You can run an image depends on whether you gave the image a tag/name or not.

// docker images
// root@dockertest:~# docker images
// REPOSITORY          TAG                 ID                  CREATED             SIZE
// ubuntu              12.04               8dbd9e392a96        4 months ago        131.5 MB (virtual 131.5 MB)

// With a name for e.g. -  in this case Ubuntu :
// docker run -i -t ubuntu:12.04 /bin/bash

// or you can run it by just using the ID:
// docker run -i -t 8dbd9e392a96 /bin/bash