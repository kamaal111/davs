package discovery

import (
	"github.com/gin-gonic/gin"
)

func propfindHandler() func(context *gin.Context) {
	return func(context *gin.Context) {
		response := `<d:multistatus xmlns:d="DAV:">
						<d:response>
							<d:href>/</d:href>
								<d:propstat>
									<d:prop>
										<d:current-user-principal>
											<d:href>/principals/users/johndoe/</d:href>
										</d:current-user-principal>
									</d:prop>
									<d:status>HTTP/1.1 200 OK</d:status>
								</d:propstat>
						</d:response>
					</d:multistatus>`
		context.Data(207, "application/xml; charset=utf-8", []byte(response))
	}
}
