import React from 'react';
import {Badge, ListGroup, ListGroupItem, Row, Stack, Table} from "react-bootstrap";

function Dsystem() {
    return (
        <>
            <div className='vstack'>
                <p className='fs-4 fw-bold'>이 문서는 Ion의 작동 방식을 구체적으로 설명하여 관리와 운용에 도움이 되도록 합니다.</p>
                <ListGroup as='ul' className='mb-4'>
                    <ListGroupItem as='li' className='fw-bold fs-5'>IonID</ListGroupItem>
                    <ListGroupItem as='a' className='ps-5' href='#ionidoutline'>개요</ListGroupItem>
                    <ListGroupItem as='a' className='ps-5' href='#status'>상태</ListGroupItem>
                    <ListGroupItem as='a' className='ps-5' href='#privilege'>권한</ListGroupItem>
                    <ListGroupItem as='li' className='fw-bold fs-5'>기타</ListGroupItem>
                    <ListGroupItem as='a' className='ps-5' href='#mainpage'>메인 페이지</ListGroupItem>
                    <ListGroupItem as='li' className='fw-bold fs-5'>관리자 페이지</ListGroupItem>
                    <ListGroupItem as='a' className='ps-5' href='#ionid'>IonID</ListGroupItem>
                    <ListGroupItem as='a' className='ps-5' href='#ns'>면학 불참</ListGroupItem>
                    <ListGroupItem as='a' className='ps-5' href='#promote'>학년 변경</ListGroupItem>
                </ListGroup>
                <hr/>
                <Row className='my-3'>
                    <p className='fw-bold fs-2 my-1'>IonID</p>
                    <Row className='mb-2'>
                        <p className='my-1 fw-bold fs-4' id='ionidoutline'>개요</p>
                        <p>IonID는 Ion을 사용하는 모든 사용자가 가지고 있는 계정입니다. IonID는 다음과 같은 정보를 가지고 있습니다.</p>
                        <Table>
                            <thead>
                            <tr>
                                <th>이름</th>
                                <th>코드</th>
                                <th>내용</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>Unique Identifier</td>
                                <td>uid</td>
                                <td>IonID의 고유번호로 정수로 자동생성됩니다. 이 번호는 Ion 내부 시스템에서 사용됩니다.</td>
                            </tr>
                            <tr>
                                <td>이름</td>
                                <td>name</td>
                                <td>사용자의 이름입니다.</td>
                            </tr>
                            <tr>
                                <td>학년 / 반 / 번호</td>
                                <td>grade / clas / scode</td>
                                <td>사용자의 학년 / 반 / 번호입니다.</td>
                            </tr>
                            <tr>
                                <td>학번 변경 플래그</td>
                                <td>scode_cflag</td>
                                <td>사용자가 학번을 변경해야하는지 표시합니다. 'true'인 경우 사용자는 다음 로그인때 학번을 변경해야합니다.</td>
                            </tr>
                            <tr>
                                <td>IonID / 암호</td>
                                <td>id / pwd</td>
                                <td>사용자의 IonID와 암호입니다.</td>
                            </tr>
                            <tr>
                                <td>최종 로그인</td>
                                <td>last_login</td>
                                <td>IonID가 마지막으로 성공적으로 로그인한 시점입니다.</td>
                            </tr>
                            <tr>
                                <td>가입 시점</td>
                                <td>join_date</td>
                                <td>IonID가 생성된 시점입니다.</td>
                            </tr>
                            <tr>
                                <td>상태</td>
                                <td>status</td>
                                <td>INACTIVATED / ACTIVATED / BANNED 의 값이 가능하며 IonID의 상태를 저장합니다.</td>
                            </tr>
                            <tr>
                                <td>권한</td>
                                <td>privilege</td>
                                <td>사용자의 권한정보입니다.</td>
                            </tr>
                            </tbody>
                        </Table>
                        <p>이러한 정보는 관리자 페이지에서 확인할 수 있습니다. 다만 암호는 보안상의 이유로 어떠한 경우에도 확인할 수 없습니다.</p>
                    </Row>
                    <Row className='mb-2'>
                        <p className='my-1 fw-bold fs-4' id='status'>상태</p>
                        <p>상태는 IonID가 Ion에서 사용될 수 있는지를 결정하는데 사용됩니다. 상태는 다음 3가지가 있습니다.</p>
                        <ul>
                            <li>INACTIVATED : IonID가 생성된 직후의 상태입니다. IonID가 생성되면 이 상태로 설정됩니다.</li>
                            <li>ACTIVATED : IonID가 Ion에서 사용될 수 있는 상태입니다. IonID가 생성된 직후 관리자가 IonID를 활성화하면 이 상태로 설정됩니다.
                            </li>
                            <li>BANNED : IonID가 Ion에서 사용될 수 없는 상태입니다. IonID가 생성된 직후 관리자가 IonID를 비활성화하면 이 상태로 설정됩니다.</li>
                        </ul>
                        <p>ACTIVATED를 제외한 나머지 상태는 로그인할 수 없도록 차단됩니다.</p>
                        <p>상태는 관리자 페이지/IonID에서 수정할 수 있습니다. FACULTY 권한이 필요하며 자기 자신의 상태는 수정할 수 없습니다.</p>
                        <p>학년 초와 같이 많은 수의 IonID를 승인해야 하는 경우 관리자 페이지에서 Ion의 기본 상태를 일시적으로 수정할 수 있습니다.</p>
                    </Row>
                    <Row className='mb-2'>
                        <p className='my-1 fw-bold fs-4' id='privilege'>권한</p>
                        <p>권한은 IonID가 Ion에서 할 수 있도록 허가된 작업을 결정하는데 사용됩니다. 권한은 다음 3가지가 있습니다.</p>
                        <Table>
                            <thead>
                            <tr>
                                <th>권한</th>
                                <td>권한 코드</td>
                                <td>내용</td>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>USER</td>
                                <td>2<sup>0</sup> = 1</td>
                                <td>일반 사용자 권한입니다. IonID를 생성하면 기본적으로 이 권한을 가집니다.</td>
                            </tr>
                            <tr>
                                <td>FACULTY</td>
                                <td>2<sup>1</sup> = 2</td>
                                <td>교직원 권한입니다. 면불을 승인, 거절, 면불 목록 조회, 면불 리스트 출력, 면불 추가가 가능합니다.</td>
                            </tr>
                            <tr>
                                <td>SUPERVISOR</td>
                                <td>2<sup>2</sup> = 4</td>
                                <td>관리자 권한입니다. 다른 IonID의 권한을 통제하고 IonID를 교직원으로 설정할 수 있으며 진급작업을 시작할 수 있습니다.</td>
                            </tr>
                            </tbody>
                        </Table>
                        <p>권한은 Bitmask를 사용하여 저장/표현됩니다. 권한은 다음과 같은 방법으로 읽을 수 있습니다.</p>
                        <div className='border p-3'>
                            <p>권한은 정수 n으로 표현됩니다.</p>
                            <p>정수 n을 이진수로 바꿉니다. 예를 들어 n=6인 경우 110이 됩니다.</p>
                            <p>이진수의 각 자릿수는 각 권한을 뜻하고 그 자리수가 1인 경우 권한이 있는것, 0인 경우 권한이 없는 것입니다. 이진수로써 더해지는 수는 권한코드와
                                같습니다.</p>
                            <p>예를 들어 6의 경우 110이므로 FACULTY와 SUPERVISOR 권한을 가지고 있습니다.</p>
                        </div>
                        <p>권한은 여러개를 중첩하여 가질 수 있습니다. 또한 하나의 권한으로는 그 권한으로 할 수 있는 작업만 할 수 있습니다. 예를 들어 권한 '5'은 면불을 승인할 수
                            없습니다.</p>
                        <p>권한의 관리는 관리자 페이지/IonID 에서 가능하며 SUPERVISOR 권한이 필요합니다. 또한 자기 자신의 권한은 수정할 수 없으며 이미 로그인되어있는 IonID의
                            권한을 수정하면 다시 로그인한 후 변경사항이 적용됩니다.</p>
                    </Row>
                </Row>
                <Row className='mb-3'>
                    <p className='fw-bold fs-2 my-1'>기타</p>
                    <Row className='mb-2'>
                        <p className='my-1 fw-bold fs-4' id='mainpage'>메인페이지</p>
                        <p>메인페이지는 사이트에 처음 접속하면 보여지는 페이지입니다. 로그인된 사용자는 메인페이지가 보여지며 로그인 되어있지 않은 경우 로그인 페이지를 보여줍니다.</p>
                        <p>메인페이지의 이미지는 매일 바뀌며 그날의 NASA APOD 사진을 보여줍니다.</p>
                    </Row>
                </Row>
                <Row className='mb-3'>
                    <p className='fw-bold fs-2 my-1'>관리자 페이지</p>
                    <Row className='mb-2'>
                        <p className='my-1 fw-bold fs-4' id='ionid'>IonID</p>
                        <Row>
                            <p className='my-1 fw-bold fs-5'>IonID 조회</p>
                            <Stack>
                                <Badge as='span' className='w-fit p-2' bg='primary'>FACULTY</Badge>
                            </Stack>
                            <p>IonID를 조회합니다. IonID를 조회하면 IonID의 정보를 확인할 수 있습니다. 조회하려는 IonID의 id를 입력해야 합니다.</p>
                        </Row>
                        <Row>
                            <p className='my-1 fw-bold fs-5'>IonID 활성화</p>
                            <Stack>
                                <Badge as='span' className='w-fit p-2' bg='primary'>FACULTY</Badge>
                            </Stack>
                            <p>IonID의 상태를 변경합니다. 활성화하려는 IonID의 id와 변경하려는 상태를 입력해야합니다. 자기 자신의 상태는 바꿀 수 없습니다.</p>
                        </Row>
                        <Row>
                            <p className='my-1 fw-bold fs-5'>IonID 권한 변경</p>
                            <Stack>
                                <Badge as='span' className='w-fit p-2' bg='primary'>SUPERVISOR</Badge>
                            </Stack>
                            <p>IonID의 권한을 변경합니다. 권한을 변경하려는 IonID의 id와 변경하려는 권한을 입력해야합니다. 자기 자신의 권한은 바꿀 수 없습니다.</p>
                        </Row>
                        <Row>
                            <p className='my-1 fw-bold fs-5'>IonID 복구</p>
                            <Stack>
                                <Badge as='span' className='w-fit p-2' bg='primary'>SUPERVISOR</Badge>
                            </Stack>
                            <p>암호 재설정 신청을 승인 / 거절합니다. 직접 신청한 본인이 자신의 IonID를 복구하려고 할 때만 승인해야 합니다. 신청을 승인하면 IonID 복구에 사용할
                                수 있는 링크가 생성됩니다. 이 링크는 한 번만 볼 수 있으며 링크가 생성된 즉시 신청한 학생에게 이를 전달해야 합니다.</p>
                        </Row>
                        <Row>
                            <p className='my-1 fw-bold fs-5'>교사로 등록</p>
                            <Stack>
                                <Badge as='span' className='w-fit p-2' bg='primary'>SUPERVISOR</Badge>
                            </Stack>
                            <p>IonID를 교직원으로 등록합니다. 교직원으로 등록하려는 IonID의 id를 입력해야합니다. 이 작업은 학년/반/번호 정보를 삭제하는 방식입니다.</p>
                        </Row>
                    </Row>
                    <Row className='mb-2'>
                        <p className='my-1 fw-bold fs-4' id='ns'>면불</p>
                        <Row>
                            <p className='my-1 fw-bold fs-5'>면불 승인</p>
                            <Stack>
                                <Badge as='span' className='w-fit p-2' bg='primary'>FACULTY</Badge>
                            </Stack>
                            <p>면불을 승인하거나 거절합니다. 자신에게 승인된 면불이 리스트로 보여지며 면불자, 장소, 사유를 확인할 수 있습니다.</p>
                            <p>이곳에는 면불 담당교사에 자신의 IonID에 등록된 이름이 포함되어있는 면불만 보여집니다.</p>
                        </Row>
                        <Row>
                            <p className='my-1 fw-bold fs-5'>면불 목록 출력</p>
                            <Stack>
                                <Badge as='span' className='w-fit p-2' bg='primary'>FACULTY</Badge>
                            </Stack>
                            <p>한 학년에서 신청된 모든 면불 목록을 리스트로 보여주고 출력할 수 있도록 합니다. 승인된 면불만 볼 수도 있고 아직 승인되지 않았거나 거절된 면불도 볼 수
                                있습니다. 하지만 면불 목록을 출력할 때는 승인된 면불만 출력할 수 있습니다.</p>
                        </Row>
                        <Row>
                            <p className='my-1 fw-bold fs-5'>면불 추가</p>
                            <Stack>
                                <Badge as='span' className='w-fit p-2' bg='primary'>FACULTY</Badge>
                            </Stack>
                            <p>면불을 추가합니다. 면불을 추가하려면 면불자의 IonID, 면불 장소, 면불 사유를 입력해야합니다. 여기서 추가된 면불의 담당교사는 추가한 본인이 됩니다.
                                면불을 추가한 후 별도로 승인해야 합니다.</p>
                        </Row>
                        <Row>
                            <p className='my-1 fw-bold fs-5'>면불 목록 조회</p>
                            <Stack>
                                <Badge as='span' className='w-fit p-2' bg='primary'>FACULTY</Badge>
                            </Stack>
                            <p>한 학생이 신청한 면불 목록을 확인하고 삭제할 수 있습니다. 학생의 학번을 입력해야 합니다.</p>
                        </Row>
                    </Row>
                    <Row className='mb-2'>
                        <p className='my-1 fw-bold fs-4' id='promote'>학년 변경</p>
                        <Row>
                            <p className='my-1 fw-bold fs-5'>진급</p>
                            <Stack>
                                <Badge as='span' className='w-fit p-2' bg='primary'>SUPERVISOR</Badge>
                            </Stack>
                            <p>진급작업을 진행합니다. 이 작업에 대해서는 관리자 페이지를 참고하세요.</p>
                        </Row>
                        <Row>
                            <p className='my-1 fw-bold fs-5'>IonID 기본 상태 변경</p>
                            <Stack>
                                <Badge as='span' className='w-fit p-2' bg='primary'>SUPERVISOR</Badge>
                            </Stack>
                            <p>IonID의 기본 상태를 변경합니다. IonID의 기본 상태는 IonID가 생성될 때 자동으로 설정되는 상태입니다. 학년초와 같이 대규모의 IonID 승인이
                                필요한 상황을 위해 있는 기능입니다.</p>
                            <p>IonID의 기본 상태는 평시에는 INACTIVATED로 설정하고 필요시 하루정도만 ACTIVATED로 바꾸는 것이 보안상 권장됩니다.</p>
                        </Row>
                    </Row>
                </Row>
            </div>
        </>
    );
}

export default Dsystem;